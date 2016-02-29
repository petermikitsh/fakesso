var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser')
    crypto = require('crypto'),
    express = require('express'),
    o2x = require('object-to-xml'),
    session = require('express-session'),
    users = require('./users').getUsers();

var app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret:'somesecrettokenhere',
  resave:false,
  saveUninitialized: false
}));

var tickets = {};

app.get('/', function (req, res) {
  if (req.session.ticket) {
    res.redirect(getRedirectURL(req));
  } else {
    res.sendFile('login.html', {root: __dirname});
  }
});

function validCredentials (credentials) {
  var user = users[credentials.username];
  if (user) {
    return user.password === credentials.password;
  } else {
    return false;
  }
}

function makeTicket (req) {
  if (!req.session.ticket) {
    var ticket = crypto.randomBytes(20).toString('hex');
    req.session.ticket = ticket;
    tickets[ticket] = users[req.body.username];
  }
}

function getRedirectURL (req) {
  var service = req.body.service || req.query.service;
  var RelayState = req.body.RelayState || req.query.RelayState;
  if (!service) {
    return '/';
  } else {
    var url = decodeURIComponent(service) + '?ticket=' + req.session.ticket;
    if (RelayState) {
      url += '&RelayState=' + RelayState;
    }
    return url;
  }
}

app.post('/', function (req, res) {
  if (validCredentials(req.body)) {
    makeTicket(req);
    res.redirect(getRedirectURL(req));
  } else {
    res.redirect('/');
  }
});

app.get('/logout', function (req, res) {
  if (req.session.ticket) {
    delete tickets[req.session.ticket];
  }
  req.session.destroy();
  res.redirect('/?logout=true');
});

app.get('/serviceValidate', function (req, res) {
  res.set('Content-Type', 'text/xml');
  if (req.query.ticket) {
    var user = tickets[req.query.ticket];
    if (user) {
      res.send(o2x({ 
        "cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'": {
          "cas:authenticationSuccess": {
            "cas:uid": user.username,
            "cas:mail": user.email,
            "cas:givenName": user.firstName,
            "cas:sn": user.lastName
          }
        }
      }));
    } else {
      res.send(o2x({
        "cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'": {
          "cas:authenticationFailure code='INVALID_TICKET'":
            "ticket '" + req.query.ticket + "' not recognized"
        }
      }));
    }
  } else {
    res.send(o2x({
      "cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'": {
        "cas:authenticationFailure code='INVALID_REQUEST'":
          "'ticket' parameter required"
      }
    }));
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log('SSO Server running on Port 3000.');
});
