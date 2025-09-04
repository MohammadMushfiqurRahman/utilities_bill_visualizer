const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const sequelize = require('../database/database');
const User = require('../models/user');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock the database
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await User.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('User created successfully');
  });

  it('should login a user and return a token', async () => {
    await User.create({ email: 'test@example.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });
});
