const supertest = require('supertest');
const app = require('../../src/server.ts');
const request = supertest(app);
import { expect } from 'chai';
import 'mocha';

// eslint-disable-next-line no-undef
describe('Get Station', () => {
    // eslint-disable-next-line no-undef
    it('Testing get Station API', (done) => {
        request
            .get('/v1/stations/?search=2&limit=10')
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
});
