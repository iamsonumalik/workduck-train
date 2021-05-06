const supertest = require('supertest');
const app = require('../../src/server.ts');
const request = supertest(app);
import { expect } from 'chai';
import 'mocha';

// eslint-disable-next-line no-undef
describe('Get Train stops', () => {
    // eslint-disable-next-line no-undef
    it('passing valid train id, should return success', (done) => {
        request
            .get('/v1/train/608ffd6868001c3ef892272d/stops')
            .expect(200)
            .end((err, res) => {
                const result = res.body;
                console.log(JSON.stringify(result));
                if (err) {
                    return done(err);
                }
                expect(result).to.be.haveOwnProperty('data');
                done();
            });
    });
    // eslint-disable-next-line no-undef
    it('passing invalid train id, should return 404', (done) => {
        request
            .get('/v1/train/608ffd6868001c3ef892272e/stops')
            .expect(404)
            .end((err, res) => {
                const result = res.body;
                console.log(JSON.stringify(result));
                if (err) {
                    return done(err);
                }
                expect(result).to.be.haveOwnProperty('data');
                done();
            });
    });
});
