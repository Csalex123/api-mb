const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    res.send({ ok: true, user: req.userId})
});

module.exports = app => app.use('/projects', router);