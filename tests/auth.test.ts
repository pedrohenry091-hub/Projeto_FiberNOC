import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/server.js';

describe('POST /api/auth/login', () => {
  it('should return a JWT token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeTruthy();
    expect(response.body.token.split('.')).toHaveLength(3);
  });

  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong-password' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should allow registering and logging in a new user', async () => {
    const username = `newuser${Date.now()}`;

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ username, password: 'senha123' });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.success).toBe(true);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username, password: 'senha123' });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.user).toBe(username);
  });
});
