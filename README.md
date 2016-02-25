fakesso
=======

A fake single-sign on server. Currently supports:

- [X] CAS
- [ ] SAML

![Screenshot](https://raw.githubusercontent.com/petermikitsh/fakesso/master/login_screen.png)

Do not use this service in a production setting. Credentials are hardcoded and an in-memory cache is used to hold tickets.

Getting Started
---------------

Install dependencies.

```
npm install
```

Start the server.

```
npm start
```

Then navigate to [http://localhost:3000](http://localhost:3000).


Endpoints
---------

## GET /

Login form page.

| Name       | Type   | Located In | Description                           | Required |
|------------|--------|------------|---------------------------------------|----------|
| service    | string | query      | URL to redirect to on successful auth | true     |
| RelayState | string | query      | Passed to service url as query param  | false    |

## POST /

Login a user.

| Name     | Type   | Located In | Description                           | Required |
|----------|--------|------------|---------------------------------------|----------|
| username | string | body       | username credential                   | true     |
| password | string | body       | password credential                   | true     |
| service  | string | body       | URL to redirect to on successful auth | true     |

## GET /serviceValidate

Validate a user's ticket. Response XML includes username, e-mail address, etc.

| Name     | Type   | Located In | Description                              | Required |
|----------|--------|------------|------------------------------------------|----------|
| ticket   | string | query      | Ticket from valid authentication request | true     |

Example Response (Valid Ticket):

```xml
<cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'>
  <cas:authenticationSuccess>
    <cas:uid>testuser1</cas:uid>
    <cas:mail>testuser1@test.com</cas:mail>
    <cas:givenName>John</cas:givenName>
    <cas:sn>Doe</cas:sn>
  </cas:authenticationSuccess>
</cas:serviceResponse>
```

Example Response (Invalid / Expired Ticket):

```xml
<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
  <cas:authenticationFailure code="INVALID_TICKET">ticket 'invalidTicket' not recognized</cas:authenticationFailure>
</cas:serviceResponse>
```

Example Response (No Ticket):

```xml
<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
  <cas:authenticationFailure code="INVALID_REQUEST">'ticket' parameter required</cas:authenticationFailure>
</cas:serviceResponse>
```

## GET /logout

Logout a user. Destroys the user's session and removes the ticket from the cache.
