import { IUser } from '../../../models/user.schema';

export interface IRegisterUser {
    name: IUser['name'];
    email: IUser['email'];
    guestUser: IUser['guestUser'];
}
