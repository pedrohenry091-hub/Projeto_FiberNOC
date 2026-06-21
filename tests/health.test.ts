import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/server';

describe('GET /health', () => {
  it('should return status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});
