// change process' current dir
process.chdir(__dirname);

// load environment variables from `.env`
require("dotenv-defaults").config();

const express = require('express'),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    app = express(),
    port = process.env.PORT || 8081,
    os = require("os"),
    path = require("path");

// enable CORS
app.use(cors());

// parse incoming request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// get AWS configuration from process.env
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET, FILEBROWSER_AWS_ROOT_PATH } = process.env;

const LocalStorage = require("./sdk").LocalStorage;
const S3Storage = require("./sdk").S3Storage;

// setup routes
app.use("/storage", require("./sdk").Router([
    new LocalStorage(),
    new S3Storage(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET, FILEBROWSER_AWS_ROOT_PATH)
]));

// home route
app.get('/', (req, res) => res.send("Vuetify File Browser server"));

app.listen(port, () => console.log(`Vuetify File Browser server listening on port ${port}!`))