import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/server.js';

describe('ONU CRUD', () => {
  it('should create, read, update and delete an ONU through the API', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    const token = loginResponse.body.token;

    const createResponse = await request(app)
      .post('/api/onus')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'ONU_TESTE_CRUD',
        mac: 'FHTT99CRUD01',
        status: 'online',
        sinal: -20,
        regiao: 'Campina Grande',
        olt: 'OLT-01',
        pon: 'PON 9'
      });

    expect(createResponse.status).toBe(201);
    const createdId = createResponse.body.id;

    const readResponse = await request(app)
      .get(`/api/onus/${createdId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(readResponse.status).toBe(200);
    expect(readResponse.body.nome).toBe('ONU_TESTE_CRUD');

    const updateResponse = await request(app)
      .put(`/api/onus/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'offline' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('offline');

    const deleteResponse = await request(app)
      .delete(`/api/onus/${createdId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);
  });
});
