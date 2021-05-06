import { IStationSearch } from './station.interface';
import Station from '../../../models/station.schema';

const { MasterService } = require('base-packages');

export class StationService extends MasterService {
    getStations(iStationSearch: IStationSearch) {
        return Station.find({
            name: { $regex: `.*${iStationSearch.search}.*` }
        })
            .skip(Number(iStationSearch.offset))
            .limit(Number(iStationSearch.limit))
            .lean();
    }
}
