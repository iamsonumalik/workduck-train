'use strict';

import GetStations from '../modules/stations/GetStations.controllers';
import validateTokenUserOrGuest from '../middlewares/validateTokenUserOrGuest.middleware';

module.exports = function (app) {
    GetStations.get(app, '/v1/stations/', [validateTokenUserOrGuest]);
};
