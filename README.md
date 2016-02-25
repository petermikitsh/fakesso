fakesso
=======

A fake single-sign on server. Currently supports:

- [X] CAS
- [ ] SAML

Do not use this service in a production setting.

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

| Name    | Type   | Located In | Description                           | Required |
|---------|--------|------------|---------------------------------------|----------|
| service | string | query      | URL to redirect to on successful auth | true     |

## POST /

Login a user.

| Name     | Type   | Located In | Description                           | Required |
|----------|--------|------------|---------------------------------------|----------|
| username | string | body       | username credential                   | true     |
| password | string | body       | password credential                   | true     |
| service  | string | body       | URL to redirect to on successful auth | true     |

## GET /serviceValidate

Validate a user's ticket. Response JSON includes username, e-mail address, etc.

| Name     | Type   | Located In | Description                              | Required |
|----------|--------|------------|------------------------------------------|----------|
| ticket   | string | query      | Ticket from valid authentication request | true     |

## /logout

Logout a user.