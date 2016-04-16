var router = require('express').Router();
var jwt = require('jsonwebtoken');

var jwtPassword = "ludum35-aa950054-038f-11e6-a953-9f8fa3b1b12c";

router.get('/', function handleRoot(request, response) {
    var data = {
        score: 500,
        name: "someone",
    };

    var token = jwt.sign(data, jwtPassword);

    response.render('scores/index', {
        token: token,
    });
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

router.post('/submit/:score', function handleScore(request, response) {
    var token = request.token;

    jwt.verify(request.params.token, jwtPassword, function(err, decoded) {
        if (err) {
            response.status(404);
            response.render('scores/scoreError');
            return;
        }

        response.render('scores/scoreSuccess', {
            token: decoded,
        });
    });
});



module.exports = router;
