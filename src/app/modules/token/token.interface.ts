// eslint-disable-next-line no-unused-vars
import { IUser } from '../../../models/user.schema';

export interface IToken {
    _id: IUser['_id'];
    email: IUser['email'];
    name: IUser['name'];
    guestUser: IUser['guestUser'];
    mobile: IUser['mobile'];
}
