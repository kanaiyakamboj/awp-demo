const express = require('express');

const packageJson = require('./package.json');

const path = require('path');

const DEFAULT_PORT = process.env.PORT || 3000;

// initialize express.
const app = express();

// serve public assets.
app.use(express.static('public'));

// set up a route for /old-app/index.html
app.get('/old-app', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// set up a route for /old-demo/index.html
app.get('/old-AWP-demo', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// set up a route for index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index_New.html'));
});

//TODO will make work later
app.get('/packageVersion', (req, res) => {
    res.json({"version":packageJson.version});
});

// Set up our server so it will listen on the port
app.listen(DEFAULT_PORT, function (error) {
  
    // Checking any error occur while listening on port
    if (error) {
        console.log('Something went wrong', error);
    }
    // Else sent message of listening
    else {
        console.log('Server is listening on port' + DEFAULT_PORT);
    }
})