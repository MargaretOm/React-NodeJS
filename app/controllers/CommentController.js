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
class CommentController{
    index(req, res){
        return db.perform(`SELECT * FROM  \`MusicianGroupNew\`.\`comments\``)
            .then(comments => {
                res.json({
                    data: { comments },
                });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({ message: "400", err });
            });
    }

    show(req,res){
        return db.perform(`SELECT * FROM  \`MusicianGroupNew\`.\`comments\` where id = ?`, req.params.id)
            .then(comment => {
                res.json({
                    data: { comment },
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
                }else{
                    return db.perform(
                        `insert into \`MusicianGroupNew\`.\`comments\` (message, email, avatar, created_at, modified_at) values (?) `,
                        [req.body.comment.message, req.body.comment.email, req.body.comment.avatar, new Date().toMysqlFormat(), new Date().toMysqlFormat()]
                    )
                        .then(comment => {
                            res.json({ comment: { id: comment.insertId,
                                    email: req.body.comment.email,
                                    avatar: req.body.comment.avatar,
                                    message: req.body.comment.message} });
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
                    delete from \`MusicianGroupNew\`.\`comments\`
                    where id = ?
                    `,
                        req.params.id
                    )
                        .then(() => {
                            res.json({ message: "Comment Deleted" });
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

let commentController = new CommentController();
exports.CommentController = commentController;