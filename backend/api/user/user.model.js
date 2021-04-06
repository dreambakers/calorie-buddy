const { mongoose } = require('../../db/connection');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        unique: true,
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9]+$/.test(v);
            },
            minlength: 5,
            message: '{VALUE} is not a valid username',
        },
    },
    email: {
        unique: true,
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
    }],
},{
    timestamps: true
});

UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return {
        email: userObject.email,
        username: userObject.username,
        _id: userObject._id,
    };
};

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({ _id: user._id.toHexString(), access }, 'my secret').toString();
    user.tokens.push({ access, token, lastUse: Date.now() });
    return user.save().then(() => token);
};

UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'my secret');
    }
    catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth',
    });
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
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.methods.removeToken = function (token) {
    const user = this;
    return user.updateOne({
      // pull operator lets us pull out a wanted object
      $pull: {
        // pull from token array the token object with the same properties as the token passed
        // into the method
        tokens: {
          // whole token object is remove
          token,
        },
      },
    });
  };

const User = mongoose.model('User', UserSchema);
module.exports = { User };