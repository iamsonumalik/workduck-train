import UserModel from '../../../models/user.schema';
import { IRegisterUser } from './user.interface';

const { MasterService } = require('base-packages');
export default class UserService extends MasterService {
    createUser(registerUser: IRegisterUser) {
        return UserModel.create(registerUser);
    }

    getUserByEmail(email: String) {
        return UserModel.findOne(
            { email: email },
            {
                password: 0,
                __v: 0
            }
        );
    }

    getUserById(_id: String) {
        return UserModel.findById(_id, {
            password: 0,
            __v: 0
        });
    }
}
