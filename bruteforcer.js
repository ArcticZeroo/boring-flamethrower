const checkPassword = require('./makeRequest');

checkPassword('dog').then(console.log).catch(console.error);