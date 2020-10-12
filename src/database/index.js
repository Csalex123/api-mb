const mongoose = require('mongoose');

try {
    mongoose.connect('mongodb://localhost/escola', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
} catch (error) {
    console.log(error);
}

mongoose.Promise = global.Promise;

module.exports = mongoose;