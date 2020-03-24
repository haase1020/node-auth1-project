const bcrypt = require('bcryptjs');

const router = require('express').Router();
const Users = require('../users/users-model.js');

router.post('/register', (req,res)=> {
    const userInfo = req.body;

    const ROUNDS = process.env.HASHING_ROUNDS || 8;

    const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

    userInfo.password = hash;

    Users.add(userInfo)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "cannot register user "});
        });
});

router.post('/login', (req,res) => {
    const { username, password } = req.body;

    Users.findBy({ username }).then(([user]) => {
        if(user && bcrypt.compareSync(password, user.password)) {
            req.session.user = {
                id: user.id,
                username: user.username
            };
            res.status(200).json({hello: user.username});
        } else {
            res.status(401).json({ message: 'invalid credentials'});
        }
    })
    .catch(error => {
        res.status(500).json({ errorMessage: 'error logging in user' })
    });
});

router.get('/logout', (req,res)=> {
    if(req.session) {
        req.session.destroy(error => {
            if (error) {
                res.status(500).json({ message: 'logout problem' });
            } else {
                res.status(200).json({ message: 'successfully logged out' });
            }
        })
    } else {
        res.status(200).json({ message: 'already logged out' })
    }
});

module.exports = router;