const users = []; // In-memory user storage for demonstration purposes

module.exports = {
    findUserByEmail: (email) => users.find(user => user.email === email),
    addUser: (user) => users.push(user)
};
