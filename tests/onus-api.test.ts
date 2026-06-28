import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import app from '../src/server.js';
import prisma from '../src/database/database.js';

describe('POST /api/onus', () => {
  beforeEach(async () => {
    await prisma.log.deleteMany();
    await prisma.onu.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new ONU', async () => {
    const response = await request(app)
      .post('/api/onus')
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
});
