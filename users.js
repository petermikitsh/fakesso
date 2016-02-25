module.exports = {
  getUsers: function () {
    return {
      testuser1: {
        username: 'testuser1',
        password: 'password1',
        email: 'testuser1@test.com',
        firstName: 'John',
        lastName: 'Doe'
      },
      testuser2: {
        username: 'testuser2',
        password: 'password2',
        email: 'testuser1@test.com',
        firstName: 'Jane',
        lastName: 'Doe'
      },
      testuser3: {
        username: 'testuser3',
        password: 'password3',
        email: 'testuser3@test.com',
        firstName: 'Judy',
        lastName: 'Doe'
      }
    }
  }
};
