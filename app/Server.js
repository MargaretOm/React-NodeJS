const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const path = require("path");
const userController = require("./controllers/UserController").UserController;
const concertController = require("./controllers/ConcertController").ConcertController;
const songController = require("./controllers/SongController").SongController;
const authController = require("./controllers/AuthController").AuthController;
const commentController = require("./controllers/CommentController").CommentController;

const logger = require('morgan');
const multer  = require("multer");
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "../app/uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname)));



app.use(multer({storage:storageConfig}).any());
app.use(bodyParser.urlencoded({extended: true}));
const commentRouter = express.Router();
app.use("/comments", commentRouter);

commentRouter.post("/new",  (req, res) => commentController.create(req, res));
commentRouter.get("/:id", (req,res) => commentController.show(req,res));
commentRouter.get("/", (req, res) => commentController.index(req, res));
commentRouter.delete("/:id", (req, res) => commentController.delete(req, res));

app.post('/sign_up',  (req, res) => authController.signUp(req, res));
app.post('/sign_in',  (req, res) => authController.signIn(req, res));

const userRouter = express.Router();
app.use("/users", userRouter);

userRouter.post("/new",  (req, res) => userController.create(req, res));
userRouter.get("/:id", (req,res) => userController.show(req,res));
userRouter.get("/", (req, res) => userController.index(req, res));
userRouter.delete("/:id", (req, res) => userController.delete(req, res));
userRouter.patch("/:id", (req, res) => userController.update(req, res));

const concertRouter = express.Router();
app.use("/concerts", concertRouter);

concertRouter.post("/new",  (req, res) => concertController.create(req, res));
concertRouter.get("/:id", (req,res) => concertController.show(req,res));
concertRouter.get("/", (req, res) => concertController.index(req, res));
concertRouter.delete("/:id", (req, res) => concertController.delete(req, res));
concertRouter.patch("/:id", (req, res) => concertController.update(req, res));

const songRouter = express.Router();
app.use("/songs", songRouter);

songRouter.post("/new",  (req, res) => songController.create(req, res));
songRouter.get("/:id", (req,res) => songController.show(req,res));
songRouter.get("/", (req, res) => songController.index(req, res));
songRouter.delete("/:id", (req, res) => songController.delete(req, res));
songRouter.patch("/:id", (req, res) => songController.update(req, res));

app.listen(port, () => console.log(`Listening on port ${port}`));

