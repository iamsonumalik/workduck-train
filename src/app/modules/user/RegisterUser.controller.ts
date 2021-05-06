import UserService from './user.service';
import { IRegisterUser } from './user.interface';
import TokenService from '../token/token.service';

const { MasterController, RequestBuilder, Joi } = require('base-packages');

export default class RegisterUserController extends MasterController {
    static doc() {
        return {
            tags: ['User Module'],
            description:
                'This is used for both api 1. Register new user and 2. sign in existing user',
            summary: ''
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().required()
            })
        );
        return payload;
    }

    async controller() {
        let { name, email } = this.data;
        const decodedOtpPayload = this.req.otpPayload || this.req.user;
        if (!email) {
            email = decodedOtpPayload.email;
        }
        let userExists = await UserService.instance().getUserByEmail(email);
        if (!userExists && decodedOtpPayload._id) {
            userExists = await UserService.instance().getUserById(
                decodedOtpPayload._id
            );
        }

        if (userExists) {
            if (!userExists.name || userExists.guestUser) {
                userExists.name = name;
            }
            userExists.guestUser = false;
            userExists.email = email;
            await userExists.save();
        } else {
            const registerFinalUser: IRegisterUser = {
                guestUser: false,
                name: name,
                email: email
            };
            userExists = await UserService.instance().createUser(
                registerFinalUser
            );
        }

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
                refreshToken,
                registered: true
            },
            'success'
        );
    }
}
