import { IUser } from '../../../models/user.schema';

export interface IOTPToken {
    email: IUser['email'];
    otp: number;
    verified: boolean;
}
