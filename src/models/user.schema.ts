import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
    fullAddress: string;
    pinCode: string;
    city: string;
    state: string;
    residence: string;
}

export interface IUser extends Document {
    _id: string;
    email: string;
    name: string;
    mobile: string;
    guestUser: boolean;
    password: String;
    address: IAddress;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    mobile: {
        type: String
    },
    guestUser: {
        type: Boolean,
        required: true
    },
    address: {
        fullAddress: {
            type: String
        },
        pinCode: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        residence: {
            type: String
        }
    },
    password: {
        type: String
    }
});

UserSchema.pre<IUser>('save', function (next) {
    // if (this.isModified('password')) {
    //     this.password = hashPassword(this.password);
    // }
    next();
});

export default mongoose.model('User', UserSchema);
