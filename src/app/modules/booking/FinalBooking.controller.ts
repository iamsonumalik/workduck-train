import BookingService from './booking.service';

const { MasterController, RequestBuilder, Joi } = require('base-packages');

export default class FinalBookingController extends MasterController {
    static doc() {
        return {
            tags: ['Booking'],
            description:
                'To confirm booking. Booking from temp will moved to final booking.',
            summary: ''
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                tempBookingId: Joi.string().required()
            })
        );
        return payload;
    }

    async controller() {
        const { tempBookingId } = this.data;
        const tempBooking = await BookingService.instance().getTempBookingById(
            tempBookingId
        );
        if (!tempBooking) {
            return new this.ResponseBuilder(404, {}, 'Your booking expired!');
        }
        await BookingService.instance().finalBooking(tempBooking);
        return new this.ResponseBuilder(201, {}, 'success');
    }
}
