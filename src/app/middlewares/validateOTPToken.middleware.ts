import { IOTPToken } from '../modules/otp/api.interface';
import TokenService from '../modules/token/token.service';
import { config } from '../../config/config';
const { ResponseBuilder } = require('base-packages');
const validateVerifiedToken = (req, res, next) => {
    const token = req.headers[config.authorization];
    const userTokenObject: IOTPToken = TokenService.instance().verify(token);
    if (userTokenObject) {
        req.otpPayload = userTokenObject;
        next();
    } else {
        let response = new ResponseBuilder(
            401,
            {
                message: 'Invalid Token'
            },
            'failure'
        );
        return res
            .status(response.statusCode)
            .header('Cache-Control', 'no-cache')
            .json(response.toObject());
    }
};
export default validateVerifiedToken;
