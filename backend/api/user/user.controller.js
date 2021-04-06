const { User } = require('./user.model');

const signUp = async (req, res) => {
    try {
        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username
        });

        const results = await Promise.all([
            User.findOne({ email: newUser.email }),
            User.findOne({ username: newUser.username })
        ]);

        if (results[0] || results[1]) {
            return res.status(400).send({
                alreadyExists: 1,
                email: !!results[0],
                username: !!results[1],
                success: 0
            });
        }

        const user = await newUser.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).json({
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
        const { username, password } = req.body;
        const user = await User.findByCredentials(username, password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: 0, notFound: error.notFound || 0 });
    }
}

const logout = async ({ user, token }, res) => {
    try {
        await user.removeToken(token);
        res.json({
            success: 1
        });
    } catch (error) {
        console.log('An error occurred logging out the user', error);
    }
}

module.exports = {
    login,
    signUp,
    logout,
}