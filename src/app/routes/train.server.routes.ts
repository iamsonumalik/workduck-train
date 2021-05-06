'use strict';

import GetTrainStops from '../modules/train/GetTrainStops.controller';
import GetTrainController from '../modules/train/GetTrain.controller';
import GetArrivalTrainController from '../modules/train/GetArrivalTrain.controller';
import GetTrainStatusController from '../modules/train/GetTrainStatus.controller';
import validateTokenUserOrGuest from '../middlewares/validateTokenUserOrGuest.middleware';

module.exports = function (app) {
    GetTrainStops.get(app, '/v1/train/:trainJourneyId/stops', [
        validateTokenUserOrGuest
    ]);
    GetTrainStatusController.get(app, '/v1/train/:trainJourneyId/status', [
        validateTokenUserOrGuest
    ]);
    GetTrainController.get(app, '/v1/trains', [validateTokenUserOrGuest]);
    GetArrivalTrainController.get(app, '/v1/trains/:stationId', [
        validateTokenUserOrGuest
    ]);
};
