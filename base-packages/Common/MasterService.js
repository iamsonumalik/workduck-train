class MasterService {
    constructor() {}

    static instance() {
        if (this.self) return this.self;
        this.self = new this();
        return this.self;
    }
}

exports = module.exports = MasterService;
