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
class SongController{
    index(req, res){
        return db.perform(`SELECT * FROM  \`MusicianGroupNew\`.\`songs\``)
            .then(songs => {
                res.json({
                    data: { songs },
                });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({ message: "400", err });
            });
    }

    show(req,res){
        return db.perform(`SELECT * FROM  \`MusicianGroupNew\`.\`songs\` where id = ?`, req.params.id)
            .then(song => {
                res.json({
                    data: { song },
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
                        `insert into \`MusicianGroupNew\`.\`songs\` (poster, title, song, created_at, modified_at) values (?) `,
                        [req.files[1] ? req.files[1].originalname : null, req.body.song.title, req.files[0] ? req.files[0].originalname : null, new Date().toMysqlFormat(), new Date().toMysqlFormat()]
                    )
                        .then(song => {
                            res.json({ song: { id: song.insertId,
                                    title: req.body.song.title,
                                    song: req.files[0] ? req.files[0].originalname : null},
                                    poster: req.files[1] ? req.files[1].originalname : null});
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
                            `update \`MusicianGroupNew\`.\`songs\` set poster = ?, title = ?, song = ?, modified_at = ? where id = ?`,
                            req.files[1] ? req.files[1].originalname : null, req.body.song.title, req.files[0] ? req.files[0].originalname : null, new Date().toMysqlFormat(), req.params.id
                        )
                            .then(song => {
                                res.json({
                                    data: { song },
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json(err);
                            });
                    }else {
                        return db.perform(
                            `update \`MusicianGroupNew\`.\`songs\` set title = ?, modified_at = ? where id = ?`,
                            req.body.song.title, new Date().toMysqlFormat(), req.params.id
                        )
                            .then(song => {
                                res.json({
                                    data: { song },
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
                    delete from \`MusicianGroupNew\`.\`songs\`
                    where id = ?
                    `,
                        req.params.id
                    )
                        .then(() => {
                            res.json({ message: "Song Deleted" });
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

let songController = new SongController();
exports.SongController = songController;