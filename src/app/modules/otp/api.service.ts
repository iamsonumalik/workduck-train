const { MasterService } = require('base-packages');
export default class OTPService extends MasterService {
    getRandomDigitsForOTP() {
        return Math.floor(Math.random() * 1000000);
    }
}
