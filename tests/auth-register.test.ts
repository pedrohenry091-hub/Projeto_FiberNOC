import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/server.js';

describe('POST /api/auth/register', () => {
  it('should create a new user account', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'novoUsuario', password: 'senha123' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      user: 'novoUsuario'
    });
  });
});
