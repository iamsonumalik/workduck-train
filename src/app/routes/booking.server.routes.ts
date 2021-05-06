'use strict';

import TempBookingController from '../modules/booking/TempBooking.controller';
import FinalBookingController from '../modules/booking/FinalBooking.controller';
import validateTokenUser from '../middlewares/validateTokenUser.middleware';
import BookingHistoryController from '../modules/booking/BookingHistory.controller';

module.exports = function (app) {
    TempBookingController.post(app, '/v1/booking/temp', [validateTokenUser]);
    FinalBookingController.post(app, '/v1/booking/final', [validateTokenUser]);
    BookingHistoryController.get(app, '/v1/bookings', [validateTokenUser]);
};
