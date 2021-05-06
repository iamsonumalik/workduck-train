'use strict';

import VerifyOTPController from '../modules/otp/VerifyOTP.controller';
import OTPController from '../modules/otp/GeneratedOTP.controller';
import validateOTPToken from '../middlewares/validateOTPToken.middleware';

module.exports = function (app) {
    VerifyOTPController.post(app, '/v1/onboarding/otp/verify', [
        validateOTPToken
    ]);
    OTPController.patch(app, '/v1/onboarding/otp/generate', []);
};
