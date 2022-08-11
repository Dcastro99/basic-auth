'use strict';

const { server } = require('../src/server.js');
const { db } = require('../src/models/index.js');
const supertest = require('supertest');
const mockRequest = supertest(server);


describe('web server authentication', () => {
  beforeEach(async () => {
    await db.sync({ force: true });
  });

  it('signs up users', async () => {
    const response = await mockRequest
      .post('/signup')
      .send({ username: 'test user', password: 'test password', role: 'user' });

    expect(response.status).toBe(201);
    expect(response.body.username).toEqual('test user');
    expect(response.body.password.startsWith('$2b$10$')).toBe(true);
    expect(response.body.password.length).toBeGreaterThan(40);
    expect(response.body.password).not.toEqual('test password');
    expect(response.body.role).toBe('user');
  });

  it('signs in users', async () => {
    const res = await mockRequest
      .post('/signup')
      .send({ username: 'test user', password: 'test password', role: 'admin' });
    const signupRes = JSON.parse(res.text);
    console.log('hahaha', signupRes.token);

    const response = await mockRequest
      .post('/signin')
      .send({ username: 'test user', password: 'test password' }).set('authorization', `${signupRes.token}`);

    console.log('hehehehe ', response.body);
    expect(response.status).toBe(200);
    expect(response.body.user.username).toEqual('test user');
  });

  it('enforces unique users', async () => {
    const res1 = await mockRequest
      .post('/signup')
      .send({ username: 'test user', password: 'test password' });

    expect(res1.status).toBe(201);

    const response = await mockRequest
      .post('/signup')
      .send({ username: 'test user', password: 'test password' });

    expect(response.status).toBe(500);
  });
});
