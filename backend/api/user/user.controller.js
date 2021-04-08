const { User } = require('./user.model');

const signUp = async (req, res) => {
    try {
        // make a new user obkect from the request body
        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username
        });

        // First we check the database for existing email OR username
        const results = await Promise.all([
            User.findOne({ email: newUser.email }),
            User.findOne({ username: newUser.username })
        ]);

        // if a user found with same username or email
        if (results[0] || results[1]) {
            // send the error and break the call
            return res.status(400).send({
                alreadyExists: 1,
                email: !!results[0],
                username: !!results[1],
                success: 0
            });
        }

        // otherwise we save the new user in the database
        const user = await newUser.save();
        // return the user as JSON object
        res.json({
            user,
            success: 1
        });
    }

    catch (error) {
        console.log(error);
        res.status(400).send({
            success: 0
        });
    }
}


const login = async (req, res) => {
    try {
        // extract username and password from the request body
        const { username, password } = req.body;
        const user = await User.findByCredentials(username, password);
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: 0, notFound: error.notFound || 0 });
    }
}

module.exports = {
    login,
    signUp
}