const { db } = require('../src/db');
const { createUser, getUser } = require('../src/handler/user');

describe('Person Handlers', () => {
  beforeEach(async () => {
    await db.sync();
  });

  it('can create a person', async () => {
    const req = {
      body: { username: 'Test User', birthday: '2010/12/22' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const created = await createUser(req, res);

    const user = res.send.mock.calls[0][0];
    expect(user).toMatchObject({
      username: 'Test User',
      birthday: new Date('2010/12/22'),
    });
  });

  it('can query a person', async () => {
    const createReq = {
      body: { username: 'Test User', birthday: '2010/12/22' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await createUser(createReq, res);

    const createdUserId = res.send.mock.calls[0][0].id;

    const getReq = { params: { id: createdUserId } };

    await getUser(getReq, res);

    expect(res.send.mock.calls[1][0]).toMatchObject({
      id: createdUserId,
      username: 'Test User',
      birthday: new Date('2010/12/22'),
    });
  });

  it('can list persons', () => { });
});
