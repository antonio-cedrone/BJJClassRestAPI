const mongoose = require('mongoose');

/*
    Functions that watches for connection problems.
*/

mongoose.connection.on('error', (err) => {
    console.log(err);
  });

mongoose.connection.on('disconnected', () => console.log('disconnected'));
