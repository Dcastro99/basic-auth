'use strict';

const { server } = require('../src/server.js');
const { db } = require('../src/models/index.js');
const supertest = require('supertest');
const mockRequest = supertest(server);
const base64 = require('base-64');


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
    await mockRequest
      .post('/signup')
      .send({ username: 'test user', password: 'test password' });
    const encodedStr = base64.encode('test user:test password');
    const response = await mockRequest
      .post('/signin')
      .set('authorization', `Basic ${encodedStr}`)
      .send({ username: 'test user', password: 'test password' });

    expect(response.status).toBe(200);
    expect(response.body.user.username).toEqual('test user');
    expect(response.body.user.password.startsWith('$2b$10$')).toBe(true);
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
