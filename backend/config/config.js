dbUrl = 'mongodb://localhost:27017/calorie-buddy';

module.exports = {
    dbConnectionUrl: process.env.MONGODB_URI || dbUrl
}
