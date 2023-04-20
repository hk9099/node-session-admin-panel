// const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const db = require('./config/mongoose');
const passport = require('passport');
const passportLocal = require('./config/passport');
const bodyParser = require('body-parser');
const bycrypt = require('bcrypt');
const flash = require('connect-flash');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const multer = require('multer');
const flashConnect = require('./config/message');
const { Pool, Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

const client = new Client({
    user: 'node_user',
    host: 'localhost',
    database: 'nodesession',
    password: 'password',
    port: 5432,
});

client.connect().then(() => {
    console.log('connected to postgres');
}).catch((err) => {
    console.log(err);
})


// client.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), message VARCHAR(255))', (err, res) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('table created');
//     }
// })



// set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './static/client')));
app.use(express.static(path.join(__dirname, './static/admin')));
app.use(express.urlencoded({ extended: true }));
app.use('/media', express.static(path.join(__dirname, 'media')))
app.use('/media/slider', express.static(path.join(__dirname, 'media/slider')))

// session
app.use(session({
    name: 'data',
    secret: 'codeadmin',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10000 * 60 * 60
    }
}));


// passport
app.use(passport.initialize());
app.use(passport.session());

// bodyparser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// set routes
app.use(flash());
app.use(flashConnect.setFlash);

// routes
app.use('/', require('./routes/client/homerouter'));
// app.get('*', async (req, res) => {
//     res.status(404).render('404');
// })

app.get('/users', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users');
        res.render('forms', { users: result.rows });
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

const blogFilepath = './nodesession/media/';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("test", path.join(__dirname, '../', blogFilepath));
        cb(null, path.join(__dirname, '../', blogFilepath))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    },
});

const upload = multer({ storage: storage });

app.post('/submit-form', upload.array('images'), async (req, res) => {
    try {
        const images = req.files.map((file) => {
            return file.filename;
        });
        const result = await client.query('INSERT INTO users (name, email, message, hobbies, images) VALUES ($1, $2, $3, $4, $5)', [req.body.name, req.body.email, req.body.message, req.body.hobbies || [], images]);
        const data = { name: req.body.name, email: req.body.email, message: req.body.message, hobbies: req.body.hobbies || [], images };
        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.send('Error ' + err);
    }
});


app.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await client.query('DELETE FROM users WHERE id = $1', [id]);
        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


// GET route for edit form
app.get('/edit/:id', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
        res.render('forms', { users: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

// POST route for updating data
app.post('/edit/:id', async (req, res) => {
    try {
        const result = await client.query('UPDATE users SET name = $1, email = $2, message = $3, hobbies = $4 WHERE id = $5', [req.body.name, req.body.email, req.body.message, req.body.hobbies || [], req.params.id]);
        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

//flash

// const server = awsServerlessExpress.createServer(app);

// exports.handler = (event, context) => {
//     awsServerlessExpress.proxy(server, event, context);
// };

app.listen(8083, () => {
    console.log('server is running on port http://localhost:8083');
})