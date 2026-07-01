import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import app from '../src/server.js';
import prisma from '../src/database/database.js';

describe('POST /api/onus', () => {
  beforeEach(async () => {
    try {
      await prisma.log.deleteMany();
      await prisma.onu.deleteMany();
    } catch {
      // fallback quando o banco não está disponível
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new ONU', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    const token = loginResponse.body.token;

    const response = await request(app)
      .post('/api/onus')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'CLIENTE_TESTE',
        mac: 'FHTT00TEST01',
        status: 'online',
        sinal: -18.4,
        regiao: 'Campina Grande',
        olt: 'OLT-CG-01',
        pon: 'PON 4'
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      nome: 'CLIENTE_TESTE',
      mac: 'FHTT00TEST01',
      status: 'online'
    });
  });

  it('should make an authorized pending ONU visible in the main ONU list', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    const token = loginResponse.body.token;

    const authorizedResponse = await request(app)
      .post('/api/unauthorized/1/authorize')
      .set('Authorization', `Bearer ${token}`);

    expect(authorizedResponse.status).toBe(201);

    const listResponse = await request(app)
      .get('/api/onus')
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nome: 'ONU PENDENTE 01',
          mac: 'FHTT09BBA123'
        })
      ])
    );

    const pendingResponse = await request(app)
      .get('/api/unauthorized')
      .set('Authorization', `Bearer ${token}`);

    expect(pendingResponse.status).toBe(200);
    expect(pendingResponse.body).toHaveLength(1);
    expect(pendingResponse.body[0]).toEqual(
      expect.objectContaining({
        status: 'pending',
        nome: expect.stringMatching(/ONU PENDENTE|ONU DEMO/)
      })
    );
  });
});
