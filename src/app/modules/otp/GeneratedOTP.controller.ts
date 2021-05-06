import OTPService from './api.service';
import { IOTPToken } from './api.interface';
import TokenService from '../token/token.service';

const { MasterController, RequestBuilder, Joi } = require('base-packages');

export default class OTPController extends MasterController {
    static doc() {
        return {
            tags: ['Onboarding'],
            description: 'Verify OTP',
            summary: 'This api will is used to verify OTP.'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                email: Joi.string().email().required()
            })
        );
        return payload;
    }

    async controller() {
        const { email } = this.data;
        const otpDigits = OTPService.instance().getRandomDigitsForOTP();
        const otpTokenDTO: IOTPToken = {
            email: email,
            otp: otpDigits,
            verified: false
        };
        const otpToken = await TokenService.instance().generateToken(
            otpTokenDTO,
            '1h'
        );
        if (!otpToken) {
            return new this.ResponseBuilder(
                400,
                { message: 'Unable to send otp. Please try again' },
                'failure'
            );
        }
        return new this.ResponseBuilder(
            200,
            {
                otpToken
            },
            'success'
        );
    }
}
