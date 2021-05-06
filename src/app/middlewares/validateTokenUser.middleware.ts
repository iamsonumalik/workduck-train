import { IToken } from '../modules/token/token.interface';
import TokenService from '../modules/token/token.service';
import { config } from '../../config/config';

const { ResponseBuilder } = require('base-packages');
const validateTokenUser = (req, res, next) => {
    const token = req.headers[config.authorization];
    const userTokenObject: IToken = TokenService.instance().verify(token);
    let response;
    if (!userTokenObject) {
        response = new ResponseBuilder(
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
    if (userTokenObject._id && !userTokenObject.guestUser) {
        req.user = userTokenObject;
        next();
    } else {
        let response = new ResponseBuilder(
            403,
            {
                message: 'Need to signup'
            },
            'failure'
        );
        return res
            .status(response.statusCode)
            .header('Cache-Control', 'no-cache')
            .json(response.toObject());
    }
};
export default validateTokenUser;
