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
  res.sendFile('login.html', {root: __dirname});
});

function validCredentials (credentials) {
  var user = users[credentials.username];
  if (user) {
    return user.password === credentials.password;
  } else {
    return false;
  }
}

app.post('/', function (req, res) {
  if (req.session.ticket && req.body.service) {
    res.redirect(req.body.service + '/?ticket=' + req.session.ticket);
  } else if (validCredentials(req.body) && req.body.service) {
    var ticket = crypto.randomBytes(20).toString('hex');
    req.session.ticket = ticket;
    tickets[ticket] = users[req.body.username];
    res.redirect(req.body.service + '/?ticket=' + ticket);
  } else {
    res.redirect('/');
  }
});

app.get('/logout', function (req, res) {
  if (req.session.ticket) {
    delete tickets[req.session.ticket]
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
