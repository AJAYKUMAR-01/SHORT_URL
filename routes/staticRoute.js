const express = require('express');
const URL = require('../models/url');
const { route } = require('./url');

const router = express.Router();

router.get('/', async (req, res) => {
    const urls = await URL.find({});
    return res.render("home", {
        urls : urls
    });
})

router.get('/signup', (req, res) => {
    return res.render("signup");
})

router.get('/login', (req, res) => {
    return res.render("login");
})
module.exports = router;