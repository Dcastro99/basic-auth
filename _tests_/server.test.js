// Assertion - check to see if something is what we expect

// expect(true).toBe(true); // SGTM
// expect(3).toBe(5); // ?? sus

// test organization - describe, it
//   describe groups tests
//   it is a single test case
// test setup

const supertest = require('supertest');
const { db } = require('../src/db');
const server = require('../src/server.js');

const request = supertest(server.app);

describe('Node Server', () => {
  it('says hello world', async () => {
    // set up the test so it can do a thing
    // Prepare the server
    // (see above)

    // perform an action, that does the thing
    // request the / route
    const response = await request.get('/'); // The response is a promise

    // assert or expect the result of the action
    // expect the / route to respond with hello
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World');
  });

  it('returns some data', async () => {
    const response = await request.get('/data');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      name: 'David',
      role: 'Instructor',
    });
  });

  it('should respond 500 on an error', async () => {
    const response = await request.get('/throw-error');

    expect(response.status).toBe(500);
  });

  it('knows about pets', async () => {
    let response = await request.get('/pets/Oliver');

    expect(response.status).toBe(200);
    expect(response.body.name).toMatch(/Oliver/);

    response = await request.get('/pets/Pippin');

    expect(response.status).toBe(200);
    expect(response.body.name).toMatch(/Pippin/);
  });

  it.skip('starts on a port', () => {
    jest.spyOn(server.app, 'listen').mockImplementation();

    server.start(3000);

    expect(server.app.listen).toHaveBeenCalledWith(3000, expect.anything());
  });

  it('returns server errors', async () => {
    let response = await request.get('/throw-error');

    expect(response.status).toBe(500);
    expect(response.text).toMatch(/This is the error generator!/);
  });

  it('returns 404 errors', async () => {
    let response = await request.get('/missing-file');

    expect(response.status).toBe(404);
  });

  describe('Users', () => {
    beforeEach(async () => {
      await db.sync();
    });

    it('creates a user', async () => {
      let response = await request.post('/user').send({
        username: 'Test User',
        birthday: '2010/12/22',
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        username: 'Test User',
        birthday: new Date('2010/12/22').toISOString(),
      });
    });

    it('retrieves a user', async () => {
      let createResponse = await request.post('/user').send({
        username: 'Test User',
        birthday: '2010/12/22',
      });

      expect(createResponse.status).toBe(200);
      const createdId = createResponse.body.id;

      let retrieveResponse = await request.get(`/user/${createdId}`);

      expect(retrieveResponse.status).toBe(200);
      expect(retrieveResponse.body).toMatchObject({
        id: createdId,
        username: 'Test User',
        birthday: new Date('2010/12/22').toISOString(),
      });
    });
  });
});
