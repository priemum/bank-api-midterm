const User = require('../models/User');
const Checking = require('../../accounts/models/Checking');
const { validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const accountUtils = require('../../accounts/utils/accountUtils')

module.exports = {
    register: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        User.findOne({ email }).then(user => {
            if (user) {
                // return req.flash('errors', 'User Already Exists');
                return res.send('User Exists');
            } else {
                const newUser = new User();
                newUser.profile.name = name;
                newUser.email = email;
                newUser.password = password;

                newUser
                .save()
                .then((user) => {
                    const checking = new Checking();
                    checking.owner = user._id;
                    console.log(accountUtils.uniqueAccountNumber);
                    checking.save()
                    return user
                })
                .then(user => {
                    req.login(user, err => {
                        if (err) {
                            return res
                            .status(400)
                            .json({ confirmation: false, message: err });
                        } else {
                            res.redirect('/');
                            next();
                        }
                    });
                })
                .catch(err => {
                    return next(err);
                });
            }
        });
    },
    
    updateProfile: (params, id) => {
        const {
            name,
            email,
            address,
            oldPassword,
            newPassword,
            repeatNewPassword
        } = params;
        return new Promise((resolve, reject) => {
            User.findById(id)
            .then(user => {
                if (name) user.profile.name = name;
                if (email) user.email = email;
                if (address) user.address = address;
                return user;
            })
            .then(user => {
                user.save().then(user => {
                resolve(user);
                });
            })
            .catch(err => reject(err));
        }).catch(err => reject(err));
    },
    
    updatePassword: (params, id) => {
        return new Promise((resolve, reject) => {
            User.findById(id)
            .then(user => {
                if (
                !params.oldPassword ||
                !params.newPassword ||
                !params.repeatNewPassword
                ) {
                    reject('All password inputs must be filled');
                } else if (params.newPassword !== params.repeatNewPassword) {
                    reject('New passwords do not match');
                } else {
                    bcrypt
                    .compare(params.oldPassword, user.password)
                    .then(result => {
                        if (result === false) {
                            reject('Old Password Incorrect');
                        } else {
                            console.log('save please');
                            user.password = params.newPassword;
                            user
                            .save()
                            .then(user => {
                                resolve(user);
                            })
                            .catch(err => {
                                throw new Error(err);
                            });
                        }
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
                }
            })
            .catch(err => {
                reject(err);
            });
        });
    },

    login: passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/api/users/login',
        failureFlash: true
    })
}