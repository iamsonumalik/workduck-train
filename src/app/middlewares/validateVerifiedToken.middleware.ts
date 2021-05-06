import TokenService from '../modules/token/token.service';
import { config } from '../../config/config';
const { ResponseBuilder } = require('base-packages');
const validateOTPToken = (req, res, next) => {
    const token = req.headers[config.authorization];
    const userTokenObject = TokenService.instance().verify(token);
    if (userTokenObject && userTokenObject._id) {
        req.user = userTokenObject;
        next();
    } else if (userTokenObject && userTokenObject.verified) {
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
export default validateOTPToken;
