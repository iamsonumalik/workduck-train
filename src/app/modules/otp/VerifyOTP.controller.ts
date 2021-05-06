import TokenService from '../token/token.service';
import { IOTPToken } from './api.interface';
import UserService from '../user/user.service';

const { MasterController, RequestBuilder, Joi } = require('base-packages');

export default class VerifyOTP extends MasterController {
    static doc() {
        return {
            tags: ['Onboarding'],
            description: 'Send OTP',
            summary: ''
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                email: Joi.string().email().required(),
                otp: Joi.number().required()
            })
        );
        return payload;
    }

    /**
     * ##Extract OTP from OTPToken

     As of now, I am not using any service for sending OTP. You can extract OTP from Token.
     1. Request for OTP. Make generate OTP request.
     2. Copy the token you will receive in response.
     3. Go to https://jwt.io/, paste token in Encoded section. You will able to decode object. Copy OTP from there.
     4. Verify OTP using same OTP and OTP Token.
     * */
    async controller() {
        const { otp, email } = this.data;
        const decodedToken = this.req.otpPayload;
        const verify =
            decodedToken &&
            decodedToken.otp === otp &&
            decodedToken.email === email;
        if (!verify) {
            return new this.ResponseBuilder(
                400,
                {
                    message: 'Unable to verify'
                },
                'failure'
            );
        }
        let userExists = await UserService.instance().getUserByEmail(
            decodedToken.email
        );
        if (userExists) {
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
        const verifiedPayload: IOTPToken = {
            email,
            otp,
            verified: true
        };
        const verifiedToken = await TokenService.instance().generateToken(
            verifiedPayload,
            '1h'
        );
        return new this.ResponseBuilder(
            200,
            {
                verifiedToken,
                registered: false
            },
            'success'
        );
    }
}
