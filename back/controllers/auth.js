const db = require("../models");
const User = db.users;

const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    const firstname = req.body.firstname;
    const lastname =  req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;

    // checking of the form
    if(firstname === null || firstname === '' || lastname === null || lastname === '' 
        || email === null || email === '' || password === null || password === '') {
        return res.status(400).json({'error': "Veuillez remplir l'ensemble des champs du formulaire"});
    }

    // Hiding the email address
    const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();
    // check if user exists in DB
    User.findOne({
        attributes: ['email'],
        where: {email: emailCryptoJs}
    })
    .then((userFound) =>{
        // if the user does not exist the DB
        if(!userFound) {
            // Password hash with bcrypt
            bcrypt.hash(password, 10)
            .then(hash => {
                const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();

                // Creation of the user
                const user = new User({
                    firstname: firstname,
                    lastname: lastname,
                    email: emailCryptoJs,
                    password: hash
                })
                user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
            })
        } else if(userFound) {
            return res.status(409).json({error: "L'utilisateur existe déjà !"})
        }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    // Hiding the email address
    const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();

    // check if user exists in DB
    User.findOne({where: { email: emailCryptoJs }})
    .then(user => {
        // if the user does not exist the DB
        if(!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'})
        }
        // Compare password of the request with that of the DB
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !'})
            }
            res.status(200).json({
                userId: user.id,
                userAdmin: user.isAdmin,
                // Création d'un token pour sécuriser le compte de l'utilisateur
                token: jwt.sign(
                    { 
                        userId: user.id, 
                        isAdmin : user.isAdmin 
                    },
                    `${process.env.JWT_KEY_SECRET}`,
                    { expiresIn: '6h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}; 