import TokenService from './token.service';
// eslint-disable-next-line no-unused-vars
import { IToken } from './token.interface';
// eslint-disable-next-line no-unused-vars
import { IRegisterUser } from '../user/user.interface';
import UserService from '../user/user.service';
import { IOTPToken } from '../otp/api.interface';
const { MasterController, RequestBuilder, Joi } = require('base-packages');

export default class TokenController extends MasterController {
    static doc() {
        return {
            tags: ['Onboarding'],
            description: 'Generate access token',
            summary: ''
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                guestUser: Joi.boolean().required().default(false),
                registerUser: Joi.object()
                    .keys({
                        email: Joi.string().email().required(),
                        otpToken: Joi.string().required(),
                        otp: Joi.number().required()
                    })
                    .when('guestUser', {
                        is: false,
                        then: Joi.object().required()
                    })
            })
        );
        return payload;
    }

    async controller() {
        const { guestUser, registerUser } = this.data;
        if (!guestUser) {
            const decodedToken: IOTPToken = await TokenService.instance().verify(
                registerUser.otpToken
            );
            const verify =
                decodedToken &&
                decodedToken.otp === registerUser.otp &&
                decodedToken.email === registerUser.email;
            if (!verify) {
                return new this.ResponseBuilder(
                    400,
                    {
                        message: 'Unable to verify'
                    },
                    'failure'
                );
            }
        }

        const registerFinalUser: IRegisterUser = {
            guestUser: guestUser,
            name: 'Guest',
            email: !guestUser ? registerUser.email : ''
        };
        const createdUser = await UserService.instance().createUser(
            registerFinalUser
        );
        const tokenObject: IToken = {
            _id: createdUser.toString(),
            name: registerFinalUser.name,
            guestUser: registerFinalUser.guestUser,
            email: registerFinalUser.email,
            mobile: null
        };
        const accessToken = TokenService.instance().generateToken(tokenObject);
        const refreshToken = TokenService.instance().generateToken(
            tokenObject,
            '60d'
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
