const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const User = require('../models/User');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secrete, {
        expiresIn: 86400,
    })
}

router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'User already exist' });
        }

        const user = await User.create(req.body);
        user.password = undefined;
        const token = generateToken({ id: user.id }); 

        return res.send({ user, token });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).send({ error: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(400).send({ error: 'Invalid password' });
    }

    user.password = undefined;

    const token = generateToken({ id: user.id }); 
 
    res.send({ user, token });
});

module.exports = app => app.use('/auth', router);