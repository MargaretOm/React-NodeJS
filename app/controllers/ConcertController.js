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
class ConcertController{
    index(req, res){
        return db.perform(`SELECT * FROM  \`MusicianGroupNew\`.\`concerts\``)
            .then(concerts => {
                res.json({
                    data: { concerts },
                });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({ message: "400", err });
            });
    }

    show(req,res){
        return db.perform(`SELECT * FROM  \`MusicianGroupNew\`.\`concerts\` where id = ?`, req.params.id)
            .then(concert => {
                res.json({
                    data: { concert },
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
                        `insert into \`MusicianGroupNew\`.\`concerts\` (place, date, created_at, modified_at) values (?) `,
                        [req.body.concert.place, req.body.concert.date, new Date().toMysqlFormat(), new Date().toMysqlFormat()]
                    )
                        .then(concert => {
                            res.json({ concert: { id: concert.insertId,
                                    place: req.body.concert.place,
                                    date: req.body.concert.date} });
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
                    return db.perform(
                        `update \`MusicianGroupNew\`.\`concerts\` set place = ?, date = ?, modified_at = ? where id = ?`,
                        req.body.concert.place, req.body.concert.date, new Date().toMysqlFormat(), req.params.id
                    )
                        .then(concert => {
                            res.json({
                                data: { concert },
                            });
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
                    delete from \`MusicianGroupNew\`.\`concerts\`
                    where id = ?
                    `,
                        req.params.id
                    )
                        .then(() => {
                            res.json({ message: "Concert Deleted" });
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

let concertController = new ConcertController();
exports.ConcertController = concertController;