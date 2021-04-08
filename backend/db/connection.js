var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/calorie-buddy', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

mongoose.set('useCreateIndex', true);

module.exports = { mongoose };