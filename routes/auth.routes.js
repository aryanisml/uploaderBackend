const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const userSchema = require('../model/user');
const { json } = require('body-parser');
const authorize = require("../middlewares/auth");
const { check, validationResult } = require('express-validator');

router.post('/newuser', [
    check('name')
        .not()
        .isEmpty()
        .isLength({ min: 3 })
        .withMessage('Name must be atleast 3 characters long'),
    check('email', 'Email is required')
        .not()
        .isEmpty(),
    check('password', 'Password should be between 5 to 8 characters long')
        .not()
        .isEmpty()
        .isLength({ min: 5, max: 8 })
],
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(req.body);

        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        }
        else {
            bcrypt.hash(req.body.password, 10).then((hash) => {
                const user = new userSchema({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                });
                user.save().then((response) => {
                    res.status(201).json({
                        message: "User successfully created!",
                        result: response
                    });
                }).catch(error => {
                    res.status(500).json({
                        error: error
                    });
                });
            });
        }
    });

// Sign-in
router.post("/signin", (req, res, next) => {
    let getUser;
    userSchema.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: "Authentication failed password not matching"
            });
        }
        let jwtToken = jwt.sign({
            email: getUser.email,
            userId: getUser._id
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });
        res.cookie('token', jwtToken, { maxAge: 1000 * 60 * 10, httpOnly: true });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 3600,
            msg: getUser
        });
     //   res.cookie('favToken', jwtToken, { maxAge: 1000 * 60 * 10, httpOnly: false })
    }).catch(err => {
        return res.status(401).json({
            message: "Authentication failed"
        });
    });
});

const getAuthFailed = (res) => {
    return res.status(401).json({
        message: "Authentication failed mmm"
    })
}
const verifyPassword = async (reqPassword, userPassword) => {
    return bcrypt.compare(reqPassword, userPassword);
}

// Sign-in
router.post("/login",
    async (req, res, next) => {
        try {
            let getUser;
            const userInfo = await userSchema.findOne({ email: req.body.email });
            if (!userInfo) {
                return getAuthFailed(res);
            }
            getUser = userInfo;
            const pswVerification = await verifyPassword(req.body.password, userInfo.password);
            if (!pswVerification) {
                return getAuthFailed(res);
            }
            let jwtToken = jwt.sign({
                email: getUser.email,
                userId: getUser._id
            }, process.env.JWT_SECRET, {
                expiresIn: "1h"
            });
            res.status(200).json({
                token: jwtToken,
                expiresIn: 3600,
                userInfo: getUser,
                statusCode: 200
            })
        } catch (error) {
            return getAuthFailed(res);
        }
    },
    (error, req, res, next) => {
        if (error) {
            res.status(500).send(error.message);
        }
    });


// Get Users
router.route('/').get((req, res) => {
    userSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

// Get Single User
router.route('/profile/:id').get(authorize, (req, res, next) => {
    userSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

// Update User
router.route('/upUser/:id').put((req, res, next) => {
    userSchema.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('User successfully updated!')
        }
    })
})


// Delete User
router.route('/dlUser/:id').delete((req, res, next) => {
    userSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})


module.exports = router;
