var express = require('express');

var web = require('./web');

// Express cconfiguration
var app = express();
app.use(express.static('public'));

// Jade
app.set('views', './web');
app.set('view engine', 'jade');

// Must respond HTTP 200 to /health for openshift
app.get('/health', function(request, response) {
    response.send(200);
});

// Homepage
app.get('/', function(request, response) {
    response.render('index');
});

// Scores
app.use('/scores', web.scores);

// Start listening
app.listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || 'localhost', function () {
    console.log(`Application worker ${process.pid} started...`);
});
