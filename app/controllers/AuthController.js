const jwt = require('jsonwebtoken');
const db = require("../db/config").databaseConnection;
const bcrypt = require('bcrypt');
const bcrypt_cost = 12;
const config = require("../auth/config");
class AuthController{
    signUp(req, res){
        return db.perform(`SELECT * FROM  \`MusicianGroupNew\`.\`users\` where email = ?`, req.body.user.email)
            .then(user => {
                if (user.length != 0) {
                    return res.status(400).json({message: "User is already registered"});
                }
                const password_hash = bcrypt.hashSync(req.body.user.password, bcrypt_cost);
                return db.perform(
                    `insert into \`MusicianGroupNew\`.\`users\` (email, password_hash, first_name, surname, last_name, date_of_birthday, photo, created_at, modified_at) values (?) `,
                    [req.body.user.email, password_hash, req.body.user.first_name, req.body.user.surname, req.body.user.last_name, req.body.user.date_of_birthday, req.files[0] ? req.files[0].originalname : null, new Date().toMysqlFormat(), new Date().toMysqlFormat()]
                )
                    .then(user => {
                        res.json({message: "User was registered successfully!"})
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json({message: "400", err});
                    });
            })
            .catch(err => {
                console.log(err);
                res.json({ err });
            })
    }

    signIn(req, res){
        const token = req.headers.access_token;
        if (token) {
            jwt.verify(token.replace('"', '').replace('"', ''), config.secret, (err, decoded) => {
                if (err) {
                    return db.perform(`SELECT * FROM  \`MusicianGroupNew\`.\`users\` where email = ?`, req.body.user.email)
                        .then(user => {
                            if (user.length == 0){
                                return res.status(400).json({ accessToken: null, message: "User didn't register" });
                            }
                            let passwordIsValid = bcrypt.compareSync(req.body.user.password, user[0].password_hash);
                            if (!passwordIsValid) {
                                return res.status(400).json({ accessToken: null, message: "Invalid Password" });
                            }
                            var token = jwt.sign({ id: user[0].id }, config.secret, {
                                expiresIn: 86400 // 24 hours
                            });
                            res.status(200).json({
                                avatar: user[0].photo,
                                email: user[0].email,
                                accessToken: token,
                                id: user[0].id
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.json({ message: "User didn't register", err });
                        })
                }else{
                    return res.status(400).json({
                        success: false,
                        message: 'User is already signed in'
                    })
                }
            });
        } else {
            return db.perform(`SELECT * FROM  \`MusicianGroupNew\`.\`users\` where email = ?`, req.body.user.email)
                .then(user => {
                    if (user.length == 0){
                        return res.status(400).json({ accessToken: null, message: "User didn't register" });
                    }
                    let passwordIsValid = bcrypt.compareSync(req.body.user.password, user[0].password_hash);
                    if (!passwordIsValid) {
                        return res.status(400).json({ accessToken: null, message: "Invalid Password" });
                    }
                    var token = jwt.sign({ id: user[0].id }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
                    res.status(200).json({
                        avatar: user[0].photo,
                        email: user[0].email,
                        accessToken: token,
                        id: user[0].id
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.json({ message: "User didn't register", err });
                })
        }
    }
}

let authController = new AuthController();
exports.AuthController = authController;