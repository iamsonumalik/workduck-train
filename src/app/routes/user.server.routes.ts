'use strict';

import UserController from '../modules/user/user.controller';
import validateTokenUserOrGuest from '../middlewares/validateTokenUserOrGuest.middleware';
import validateVerifiedToken from '../middlewares/validateVerifiedToken.middleware';
import RegisterUserController from '../modules/user/RegisterUser.controller';
import GuestUserController from '../modules/user/GuestUser.controller';

module.exports = function (app) {
    UserController.get(app, '/v1/user', [validateTokenUserOrGuest]);
    RegisterUserController.post(app, '/v1/user', [validateVerifiedToken]);
    GuestUserController.post(app, '/v1/user/guest');
};
