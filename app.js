var rooty = require('rooty');
rooty('./');

var express = require('express');

var app = express();
app.set('views', './http_views');
app.set('view engine', 'jade');

app.get('/', function(request, response) {
    response.render('home', {
        raw: {
            request: request,
        },
    });
});

// Must respond HTTP 200 to /health for openshift
app.get('/health', function(request, response) {
    response.send(200);
});

app.listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || 'localhost', function () {
    console.log(`Application worker ${process.pid} started...`);
});
