const config = require("../auth/config");
const jwt = require('jsonwebtoken');

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};
const db = require("../db/config").databaseConnection;
class UserController{


    index(req, res){
        return db.perform(`SELECT * FROM  \`MusicianGroupNew\`.\`users\` where email IS NULL`)
            .then(users => {
                res.json({
                    data: { users },
                });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({ message: "400", err });
            });
    }

    show(req,res){
        return db.perform(`SELECT * FROM  \`MusicianGroupNew\`.\`users\` where id = ?`, req.params.id)
            .then(user => {
                res.json({
                    data: { user },
                });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({ message: "400", err });
            });
    }

    create(req, res){
        const token = req.headers.access_token;
        if (token) {
            jwt.verify(token.replace('"', '').replace('"', ''), config.secret, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: 'Token is not valid'
                    });
                }else if (decoded.id !== 1){
                    return res.status(401).json({
                        success: false,
                        message: 'Action only for admin'
                    });
                }else{
                    return db.perform(
                        `insert into \`MusicianGroupNew\`.\`users\` (description, first_name, surname, last_name, date_of_birthday, photo, created_at, modified_at) values (?) `,
                        [req.body.user.description, req.body.user.firstName, req.body.user.surname, req.body.user.lastName, req.body.user.dateOfBirthday, req.files[0] ? req.files[0].originalname : null, new Date().toMysqlFormat(), new Date().toMysqlFormat()]
                    )
                        .then(user => {
                            res.json({ user: { id: user.insertId,
                                            description: req.body.user.description,
                                            first_name: req.body.user.firstName,
                                            surname: req.body.user.surname,
                                            last_name: req.body.user.lastName,
                                            date_of_birthday: req.body.user.dateOfBirthday,
                                            photo: req.files[0] ? req.files[0].originalname : null} });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).json({ message: "400", err });
                        });
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    }

    update(req, res){
        const token = req.headers.access_token;
        if (token) {
            jwt.verify(token.replace('"', '').replace('"', ''), config.secret, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: 'Token is not valid'
                    });
                }else if (decoded.id !== 1){
                    return res.status(401).json({
                        success: false,
                        message: 'Action only for admin'
                    });
                }else{
                    if (req.files[0]){
                        return db.perform(
                            `update \`MusicianGroupNew\`.\`users\` set description = ?, first_name = ?, surname = ?, last_name = ?, date_of_birthday = ?, photo = ?, modified_at = ? where id = ?`,
                            req.body.user.description, req.body.user.firstName, req.body.user.surname, req.body.user.lastName, req.body.user.dateOfBirthday, req.files[0] ? req.files[0].originalname : null, new Date().toMysqlFormat(), req.params.id
                        )
                            .then(user => {
                                res.json({
                                    data: { user },
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json(err);
                            });
                    }else {
                        return db.perform(
                            `update \`MusicianGroupNew\`.\`users\` set description = ?, first_name = ?, surname = ?, last_name = ?, date_of_birthday = ?, modified_at = ? where id = ?`,
                            req.body.user.description, req.body.user.firstName, req.body.user.surname, req.body.user.lastName, req.body.user.dateOfBirthday, new Date().toMysqlFormat(), req.params.id
                        )
                            .then(user => {
                                res.json({
                                    data: { user },
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json(err);
                            });
                    }
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    }

    delete(req, res){
        const token = req.headers.access_token;
        if (token) {
            jwt.verify(token.replace('"', '').replace('"', ''), config.secret, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: 'Token is not valid'
                    });
                }else if (decoded.id !== 1){
                    return res.status(401).json({
                        success: false,
                        message: 'Action only for admin'
                    });
                }else{
                    return db.perform(
                        `
                    delete from \`MusicianGroupNew\`.\`users\`
                    where id = ?
                    `,
                        req.params.id
                    )
                        .then(() => {
                            res.json({ message: "User Deleted" });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).json(err);
                        });
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    }
}

let userController = new UserController();
exports.UserController = userController;