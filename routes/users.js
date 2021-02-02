const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auht')
const _ = require('lodash');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');

router.get('/me', auth, async (req,res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/signup', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

   let user = await User.findOne({email : req.body.email});
   if (user) return res.status(400).send('Email is already registred');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    sgMail.setApiKey('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')
    const msg = {
    to: req.body.email, 
    from: 'ali0000samy@gmail.com', 
    subject: 'Welcome',
    html: '<strong>Welcome to our site</strong>',
    }
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })

    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,['_id','name', 'email']));
});

module.exports = router
