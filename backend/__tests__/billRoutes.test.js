const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const billRoutes = require('../routes/billRoutes');
const sequelize = require('../database/database');
const Bill = require('../models/bill');

const app = express();
app.use(express.json());
app.use('/api', billRoutes);

// Mock the database
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await Bill.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Bill Routes', () => {
  it('should get all bills', async () => {
    await Bill.create({ amountDue: 100, dueDate: new Date(), usage: 500 });
    await Bill.create({ amountDue: 200, dueDate: new Date(), usage: 600 });

    const res = await request(app).get('/api/bills');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });

  it('should upload a bill', async () => {
    const pdfPath = path.join(__dirname, 'dummy.pdf');

    const res = await request(app)
      .post('/api/upload')
      .attach('bill', pdfPath);

    expect(res.statusCode).toEqual(201);
    expect(res.body.bill.amountDue).toEqual(123.45);
    expect(res.body.bill.usage).toEqual(500);
  });
});
