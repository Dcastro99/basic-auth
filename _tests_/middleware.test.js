const { logger } = require('../src/middleware/logger');
const { validate } = require('../src/middleware/validator');

describe('Middleware', () => {
  // Test that logger calls console.log
  it('logs via console.log', () => {
    jest.spyOn(console, 'log').mockImplementation();

    // Phase 1: set up
    const req = { method: 'GET', url: '/' };
    const res = {};
    const next = () => { };

    //Action
    logger(req, res, next);

    // Phase 3: assertions
    // What do we assert here? How do we know console.log was called?
    expect(console.log).toHaveBeenCalledWith('GET', '/');
  });

  // Test that logger calls `next()` to pass control to the next middleware
  it('calls next()', () => {
    const req = { method: 'GET', url: '/' };
    const res = {};
    const next = jest.fn();

    //Action
    logger(req, res, next);

    // Assetion
    expect(next).toHaveBeenCalled();
  });

  describe('validator', () => {
    it('passes with a name param', () => {
      const req = { method: 'GET', url: '/', params: { name: 'David' } };
      const res = {};
      const next = jest.fn();

      validate(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('fails without a name param', () => {
      const req = { method: 'GET', url: '/', params: {} };
      const res = {};
      const next = jest.fn();

      expect(() => {
        validate(req, res, next);
      }).toThrow();
    });
  });
});
