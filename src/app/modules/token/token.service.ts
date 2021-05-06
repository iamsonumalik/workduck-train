import { IToken } from './token.interface';

const { MasterService } = require('base-packages');
import jwt = require('jsonwebtoken');

export default class TokenService extends MasterService {
    generateToken(tokenPayload, expiresIn = '5d') {
        return jwt.sign(tokenPayload, process.env.TOKEN_SECRET, {
            expiresIn: expiresIn,
            algorithm: 'HS384'
        });
    }

    verify(token: string) {
        try {
            return jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    generateAccessTokenAndRefreshToken(userExists) {
        const tokenObject: IToken = {
            _id: userExists._id.toString(),
            name: userExists.name,
            guestUser: userExists.guestUser,
            email: userExists.email,
            mobile: null
        };
        const accessToken = TokenService.instance().generateToken(tokenObject);
        const refreshToken = TokenService.instance().generateToken(
            tokenObject,
            '60d'
        );
        return {
            accessToken,
            refreshToken
        };
    }
}
