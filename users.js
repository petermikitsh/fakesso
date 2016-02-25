module.exports = {
  getUsers: function () {
    return {
      testuser1: {
        username: 'testuser1',
        password: 'password1',
        email: process.env.MAIL_PREFIX + 'test+1@gmail.com',
        firstName: 'John',
        lastName: 'Doe'
      },
      testuser2: {
        username: 'testuser2',
        password: 'password2',
        email: process.env.MAIL_PREFIX + 'test+2@gmail.com',
        firstName: 'Jane',
        lastName: 'Doe'
      },
      testuser3: {
        username: 'testuser3',
        password: 'password3',
        email: process.env.MAIL_PREFIX + 'test+3@gmail.com',
        firstName: 'Judy',
        lastName: 'Doe'
      },
      testuser4: {
        username: 'testuser4',
        password: 'password4',
        email: process.env.MAIL_PREFIX + 'test+4@gmail.com',
        firstName: 'Joseph',
        lastName: 'Doe'
      }
    }
  }
};
