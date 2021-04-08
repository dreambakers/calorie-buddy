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