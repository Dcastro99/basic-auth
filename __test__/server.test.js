'use strict';

const { server } = require('../src/server.js');
const { db } = require('../src/models/index.js');
const supertest = require('supertest');
const mockRequest = supertest(server);
let signupRes;
beforeAll(async () => {
  await db.sync();
  const res = await mockRequest
    .post('/signup')
    .send({ username: 'test user', password: 'test password', role: 'admin' });
  signupRes = JSON.parse(res.text);
});
afterAll(async () => {
  await db.drop();
});

describe('web server', () => {
  it('should respond with a 404 on an invalid route', () => {
    return mockRequest.get('/foobar').then((results) => {
      expect(results.status).toBe(404);
    });
  });

  // These tests are wired with async/await --- so much cleaner!
  it('should respond with a 404 on an invalid method', async () => {
    const response = await mockRequest.put('/food');
    expect(response.status).toBe(404);
  });

  it('can create a record', async () => {

    const data = {
      name: 'carrots',
      calories: 25,
      type: 'vegetable',

    };

    const response = await mockRequest.post('/v1/food').send(data).set('authorization', `${signupRes.token}`);

    expect(response.status).toBe(200);

    //Did we get an ID?
    expect(response.body.id).toBeDefined();

    // Is the data we sent in the database?
    Object.keys(data).forEach((key) => {
      expect(data[key]).toEqual(response.body[key]);
    });
  });

  it('can get list of records', async () => {
    const response = await mockRequest.get('/v1/food');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toEqual(1);
  });

  it('can get a record', async () => {
    const response = await mockRequest.get('/v1/food/1');
    expect(response.status).toBe(200);
    expect(typeof response.body).toEqual('object');
    expect(response.body.id).toEqual(1);
  });

  it('can update a record', async () => {

    const data = { name: 'Broccoli' };
    const response = await mockRequest.put('/v1/food/1').send(data).set('authorization', `${signupRes.token}`);
    expect(response.status).toBe(200);
    expect(typeof response.body).toEqual('object');
    expect(response.body.id).toEqual(1);
    expect(response.body.name).toEqual('Broccoli');
  });

  it('can delete a record', async () => {

    const response = await mockRequest.delete('/v1/food/1').set('authorization', `${signupRes.token}`);
    expect(response.status).toBe(200);

    const getResponse = await mockRequest.get('/v1/food');
    expect(getResponse.body.length).toEqual(0);
  });
});
