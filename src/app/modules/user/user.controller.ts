import UserService from './user.service';

const { MasterController } = require('base-packages');

export default class UserController extends MasterController {
    static doc() {
        return {
            tags: ['User Module'],
            description: 'Get User details',
            summary: ''
        };
    }

    async controller() {
        const { _id } = this.data.user;
        let userDetails = await UserService.instance().getUserById(_id);
        return new this.ResponseBuilder(
            200,
            {
                user: userDetails
            },
            'success'
        );
    }
}
