const validator = require('validator');
const { register, login } = require('../services/authService');
const { parseError } = require('../util/parser');

const registerController = require('express').Router();
const loginController = require('express').Router();
const logoutController = require('express').Router();


registerController.get('/', (req, res) => {

    res.render('register', {
        title: 'Register Page'
    });
});

registerController.post('/', async (req, res) => {
    try {
        if (req.body.username == '' || req.body.email == '' || req.body.password == '') {
            throw new Error('Всички полета са задължителни.');
        }
        if (validator.isEmail(req.body.email) == false) {
            throw new Error('Невалиден имейл!');
        }
        if (req.body.password.length < 3) {
            throw new Error('Паролата трябва да е минимум 3 символа.')
        }
        if (req.body.password != req.body.repass) {
            throw new Error('Паролите не съвпадат!');
        }
        const token = await register(req.body.username, req.body.email, req.body.password);

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/catalog/backery');
    } catch (error) {
        const errors = parseError(error);

        res.render('register', {
            title: 'Register Page',
            errors,
            body: {
                username: req.body.username,
                email: req.body.email
            }
        });
    }

});

loginController.get('/', (req, res) => {

    res.render('login', {
        title: 'Login Page',
    });
});

loginController.post('/', async (req, res) => {
    try {
        const token = await login(req.body.email, req.body.password);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/catalog/backery');
    } catch (error) {
        const errors = parseError(error);

        res.render('login', {
            title: 'Login Page',
            errors,
            body: {
                email: req.body.email
            }
        });
    }
});

logoutController.get('/', (req, res) => {
    res.clearCookie('token');
    res.redirect('/catalog/backery');
});

module.exports = {
    registerController,
    loginController,
    logoutController
};