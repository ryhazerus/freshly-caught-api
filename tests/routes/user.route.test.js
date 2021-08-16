require('dotenv').config();

const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const http = require('http');
const bcrypt = require('bcryptjs');

const app = require('../../app');
const UserModel = require('../../models/user.model');
const MockUserFixture = require('../fixtures/user.fixture.json');

describe("/api/v1/users", () => {
    beforeAll(done => {
        server = http.createServer(app);
        server.listen(done);

        sinon.stub(UserModel.prototype, 'save').callsFake(() => {
            return { ...MockUserFixture };
        });

        sinon.stub(UserModel.__proto__, 'findOne').callsFake(async () => {
            let user = { ...MockUserFixture };
            let hashedPassword = await bcrypt.hash(user.password, 8);
            user.password = hashedPassword;
            return { ...user };
        });

    });

    afterAll(done => {
        server.close(done);
    });

    describe('/api/v1/users/register', () => {
        it('Should register a new user', (done) => {
            request(server)
                .post('/api/v1/users/register')
                .send(MockUserFixture)
                .expect((res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('user');
                    expect(res.body.user).to.have.property('username');
                    expect(res.body.user).to.have.property('email');
                    expect(res.body.user).to.have.property('registration_date');
                    expect(res.body.user).to.have.property('_id');
                    expect(res.body.user).to.have.property('tokens');
                })
                .expect(201, done);
        });

        it('Should fail to register a new if no username field', (done) => {
            let user = { ...MockUserFixture };
            delete user.username;

            request(server)
                .post('/api/v1/users/register')
                .send(user)
                .expect((res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.error).to.equal('Error occurred during registration');
                })
                .expect(400, done);
        });

        it('Should fail to register a new if no email field', (done) => {
            let user = { ...MockUserFixture };
            delete user.email;

            request(server)
                .post('/api/v1/users/register')
                .send(user)
                .expect((res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.error).to.equal('Error occurred during registration');
                })
                .expect(400, done);
        });

        it('Should fail to register a new if no password field', (done) => {
            let user = { ...MockUserFixture };
            delete user.password;

            request(server)
                .post('/api/v1/users/register')
                .send(user)
                .expect((res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.error).to.equal('Error occurred during registration');
                })
                .expect(400, done);
        });
    });
});