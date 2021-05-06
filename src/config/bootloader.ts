import { mongoConnection } from '../models';
import trains from '../sample/trains';
import stations from '../sample/stations';
import trainRoutes from '../sample/trainRoutes';
import Station from '../models/station.schema';
import TrainRoute from '../models/trainRoute.schema';
import TrainJourney from '../models/trainJourney.schema';
import TrainHistory from '../models/trainHistory.schema';
import Train from '../models/train.schema';
import * as moment from 'moment';
import trainHistory from '../sample/trainHistory';

const migrateData = async () => {
    const alreadyMigrated = await Station.findOne();
    if (!alreadyMigrated) {
        await Train.insertMany(trains);
        await Station.insertMany(stations);
        await TrainRoute.insertMany(trainRoutes);
        const trainJourneyd = trainRoutes.map((item) => {
            const letDate = moment().add(5);
            // @ts-ignore
            item._id = item.tempTJI;
            item.source.time = letDate
                .add(item.source.time, 'minutes')
                .valueOf();
            item.destination.time = letDate
                .add(item.destination.time, 'minutes')
                .valueOf();
            item.route = item.route.map((route) => {
                route.arrivalTime = letDate
                    .add(route.arrivalTime, 'minutes')
                    .valueOf();
                route.departureTime = letDate
                    .add(route.departureTime, 'minutes')
                    .valueOf();
                return route;
            });
            delete item.tempTJI;
            return item;
        });
        await TrainJourney.insertMany(trainJourneyd);
        await TrainHistory.insertMany(trainHistory);
    }
};

module.exports = function () {
    mongoConnection()
        .then(async () => {
            await migrateData();
        })
        .catch((err) => {
            throw err;
        });
};
