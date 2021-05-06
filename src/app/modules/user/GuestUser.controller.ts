import UserService from './user.service';
import { IRegisterUser } from './user.interface';
import TokenService from '../token/token.service';

const { MasterController } = require('base-packages');

export default class GuestUserController extends MasterController {
    static doc() {
        return {
            tags: ['User Module'],
            description: 'Login as guest user',
            summary: ''
        };
    }

    async controller() {
        const registerFinalUser: IRegisterUser = {
            guestUser: true,
            name: 'Guest User',
            email: ''
        };
        const userExists = await UserService.instance().createUser(
            registerFinalUser
        );
        const {
            accessToken,
            refreshToken
        } = TokenService.instance().generateAccessTokenAndRefreshToken(
            userExists
        );
        return new this.ResponseBuilder(
            200,
            {
                accessToken,
                refreshToken
            },
            'success'
        );
    }
}
