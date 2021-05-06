import { IStation } from '../../../models/station.schema';
import { IPagination } from '../../../types/interfaces';

export interface ISearchTrainRoute extends IPagination {
    source: IStation['_id'];
    destination: IStation['_id'];
    travelDate: number;
    upto: number;
}

export interface ITrainArrivals extends IPagination {
    station: IStation['_id'];
    fromDate: number;
    toDate: number;
}
