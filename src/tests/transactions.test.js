const chai = require('chai');
const request = require('supertest');
const app = require('../server');

const { expect } = chai;

const transaction_1 = {
  payer: 'DANNON',
  points: 300,
  timestamp: new Date('2020-10-31T10:00:00Z').toISOString(),
};
const transaction_2 = {
  payer: 'UNILEVER',
  points: 200,
  timestamp: new Date('2020-10-31T11:00:00Z').toISOString(),
};
const transaction_3 = {
  payer: 'DANNON',
  points: -200,
  timestamp: new Date('2020-10-31T15:00:00Z').toISOString(),
};
const transaction_4 = {
  payer: 'MILLER COORS',
  points: 10000,
  timestamp: new Date('2020-11-01T14:00:00Z').toISOString(),
};
const transaction_5 = {
  payer: 'DANNON',
  points: 1000,
  timestamp: new Date('2020-11-02T14:00:00Z').toISOString(),
};

describe('Before Spend Transactions', async () => {
  it('GET all transactions', async () => {
    const { body, status } = await request(app).get('/transactions');

    expect(status).to.equal(200);
    expect(body)
      .to.be.an('array')
      .to.include.deep.members([
        transaction_1,
        transaction_2,
        transaction_3,
        transaction_4,
        transaction_5,
      ]);
  });

  it('GET the balance', async () => {
    const { body, status } = await request(app).get('/transactions/balance');

    expect(status).to.equal(200);
    expect(body).to.be.an('object').to.own.include({
      DANNON: 1100,
      UNILEVER: 200,
      'MILLER COORS': 10000,
    });
  });
});

describe('Prompt Spend Transaction', async () => {
  it('POST a new spend', async () => {
    const { body, status } = await request(app)
      .post('/transactions/spend')
      .send({ points: 5000 });

    expect(status).to.equal(200);
    expect(body)
      .to.be.an('array')
      .to.include.deep.members([
        { payer: 'DANNON', points: -100 },
        { payer: 'UNILEVER', points: -200 },
        { payer: 'MILLER COORS', points: -4700 },
      ]);
  });

  it('GET the balance', async () => {
    const { body, status } = await request(app).get('/transactions/balance');

    expect(status).to.equal(200);
    expect(body).to.be.an('object').to.own.include({
      DANNON: 1000,
      UNILEVER: 0,
      'MILLER COORS': 5300,
    });
  });
});

describe('Spend Transaction to make balance = 0', async () => {
  it('POST a new spend', async () => {
    const { body, status } = await request(app)
      .post('/transactions/spend')
      .send({ points: 6300 });

    expect(status).to.equal(200);
    expect(body)
      .to.be.an('array')
      .to.include.deep.members([
        { payer: 'MILLER COORS', points: -5300 },
        { payer: 'DANNON', points: -1000 },
      ]);
  });

  it('GET the balance', async () => {
    const { body, status } = await request(app).get('/transactions/balance');

    expect(status).to.equal(200);
    expect(body).to.be.an('object').to.own.include({
      DANNON: 0,
      UNILEVER: 0,
      'MILLER COORS': 0,
    });
  });
});

describe('Spend Transaction Error', async () => {
  it('POST a new spend error', async () => {
    const { body, status } = await request(app)
      .post('/transactions/spend')
      .send({ points: 1 });

    expect(status).to.equal(405);
    expect(body.message).to.equal('More points required.');
    expect(body.data).to.be.an('integer').equal.to(1);
  });

  it('GET the balance', async () => {
    const { body, status } = await request(app).get('/transactions/balance');

    expect(status).to.equal(200);
    expect(body).to.be.an('object').to.own.include({
      DANNON: 0,
      UNILEVER: 0,
      'MILLER COORS': 0,
    });
  });
});

describe('Post Spend Transactions', async () => {
  it('GET all transactions', async () => {
    const { body, status } = await request(app).get('/transactions');

    expect(status).to.equal(200);
    expect(body).to.be.an('array');

    const withTimestamp = body.slice(0, 5);
    expect(withTimestamp).to.include.deep.members([
      transaction_1,
      transaction_2,
      transaction_3,
      transaction_4,
      transaction_5,
    ]);

    const withoutTimestamp = body.slice(5);
    withoutTimestamp.forEach((x) => {
      delete x.timestamp;
    });

    expect(withoutTimestamp).to.include.deep.members([
      {
        payer: 'DANNON',
        points: -100,
      },
      {
        payer: 'UNILEVER',
        points: -200,
      },
      {
        payer: 'MILLER COORS',
        points: -4700,
      },
      {
        payer: 'MILLER COORS',
        points: -5300,
      },
      {
        payer: 'DANNON',
        points: -1000,
      },
    ]);
  });
});
