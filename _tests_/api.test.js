const supertest = require('supertest');
const { getPerson } = require('../src/handler/person');
const { app } = require('../src/server');

describe('API routes', () => {
  beforeEach(async () => {
    await db.sync();
  });
  describe('person', () => {
    it('fills in a person', () => {
      const req = { method: 'GET', url: '/', params: { name: 'David' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      getPerson(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ name: 'David' });
    });
    it('uses the validator for person', async () => {
      const request = supertest(app);
      const result = await request.get('/person/');

      expect(result.status).toBe(404);
    });
  });
});
