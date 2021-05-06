'use strict';

module.exports = function (app) {
    // var authCtrl = require('../../app/controllers/auth.server.controller');

    app.get('/', function (req, res) {
        res.render('index', {
            head: {
                title: 'train-workduck-api '
            },
            content: {
                title: 'Hi there!',
                description: 'Welcome to train-workduck-api. You are all set up'
            }
        });
    });
};
