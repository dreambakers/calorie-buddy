const { mongoose } = require('../../db/connection');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        // unique flag to ensure that all usernames are unique
        unique: true,
        type: String,
        required: true
    },
    email: {
        // unique flag to ensure that all emails are unique
        unique: true,
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

// overriding the toJSON function to only send non-sensitive info back to front-end
UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return {
        email: userObject.email,
        username: userObject.username,
        _id: userObject._id,
    };
};

UserSchema.statics.findByCredentials = function (username, password) {
    let User = this;
    return User.findOne({ username }).then((user) => {
        if (!user) {
            return Promise.reject({ notFound: 1 });
        }
        return new Promise((resolve, reject) => {   //we're defining a new promise here since bcrypt doesn't support promises
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                }
                else {
                    reject({ notFound: 1 });
                }
            });
        });
    });
};

UserSchema.pre('save', function (next) {   //mongoose middleware, this is going to run before save is called
    let user = this;
    if (user.isModified('password')) {    //checking to see if password is already hashed
        bcrypt.genSalt(10, (err, salt) => {
            // hash the user password
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = { User };