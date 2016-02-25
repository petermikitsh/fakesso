var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser')
    crypto = require('crypto'),
    express = require('express'),
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
    var url = service + '/?ticket=' + req.session.ticket;
    if (req.body.RelayState) {
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
  if (req.query.ticket) {
    var user = tickets[req.query.ticket];
    if (user) {
      var userCopy = JSON.parse(JSON.stringify(user));
      delete userCopy.password;
      res.json(userCopy);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log('SSO Server running on Port 3000.');
});
