var router = require('express').Router();
var jwt = require('jsonwebtoken');

var db = require.main.require('./db');

var jwtPassword = "ludum35-aa950054-038f-11e6-a953-9f8fa3b1b12c";

function getShareUrl(token) {
    return "https://ludum35-onlycentral.rhcloud.com/scores/share/" + token;
}

router.get('/', function handleRoot(request, response) {
    db.Scores.findAll({
        attributes: [
            'name',
            'score',
            [db.sequelize.fn('UNIX_TIMESTAMP', db.sequelize.col('timestamp')), 'timestamp'],
            [db.sequelize.fn('date_format', db.sequelize.col('timestamp'), '%Y-%m-%d %H:%i:%s'), 'utc'],
        ],
        order: [
            ['score', 'DESC'],
        ],
        limit: 250,
    }).then(function haveScores(scores) {
        if (request.query.format === "json") {
            response.send(JSON.stringify(scores));
        }

        return response.render('scores/index', {
            scores: scores,
        });
    });
});

router.get('/share/:token', function handleScore(request, response) {
    var token = request.params.token;

    jwt.verify(token, jwtPassword, function(err, decoded) {
        if (err) {
            response.status(404);
            response.render('scores/shareError');
            return;
        }

        var textScore = Number(decoded.score).toFixed(0);
        if (decoded.score === 1) {
            textScore = decoded.score + " wall"
        } else {
            textScore = decoded.score + " walls"
        }

        response.render('scores/shareSuccess', {
            token: token,
            decoded: decoded,
            name: decoded.name,
            score: textScore,
            shareHashtags: encodeURIComponent("ForTheGlory,LDJAM"),
            shareUrl: getShareUrl(token),
            shareUrlEncoded: encodeURIComponent(getShareUrl(token)),
            shareMessageEncoded: encodeURIComponent("For The Glory! I passed " + textScore + ". The challenge has been set!"),
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

    // Save to DB, don't worry if it doesn't work
    db.Scores.build({
        ip: request.headers['x-forwarded-for'] || request.connection.remoteAddress,
        name: data.name,
        score: Number(data.score),
        payload: JSON.stringify(data),
    }).save();

    var token = jwt.sign(data, jwtPassword);
    return response.send(getShareUrl(token));
});

module.exports = router;
