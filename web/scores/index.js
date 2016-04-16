var router = require('express').Router();
var jwt = require('jsonwebtoken');

var jwtPassword = "ludum35-aa950054-038f-11e6-a953-9f8fa3b1b12c";

router.get('/', function handleRoot(request, response) {
    response.render('scores/index');
});

router.get('/share/:token', function handleScore(request, response) {
    jwt.verify(request.params.token, jwtPassword, function(err, decoded) {
        if (err) {
            response.status(404);
            response.render('scores/shareError');
            return;
        }

        response.render('scores/shareSuccess', {
            token: decoded,
        });
    });
});

router.post('/submit', function handleScore(request, response) {
    var err = null;

    if (typeof request.query.name !== "string") {
        err = new Error("invalid name");
    }

    if (typeof request.query.score !== "string") {
        err = new Error("invalid score");
    }

    if (typeof request.query.iat !== "undefined") {
        err = new Error("invalid iat");
    }

    if (err) {
        response.sendStatus(400);
        return;
    }

    var data = request.query;

    var token = jwt.sign(data, jwtPassword);
    return response.send("https://ludum35-onlycentral.rhcloud.com/scores/share/" + token);
});

module.exports = router;
