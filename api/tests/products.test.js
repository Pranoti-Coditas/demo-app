import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const seed = () => ({
  products: [{ id: 1, name: 'Claw hammer', category: 'Tools', price: 549, stock: 18 }],
});

describe('products API', () => {
  let app;
  beforeEach(() => {
    app = createApp(seed());
  });

  it('lists products', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('creates a valid product', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Spirit level', category: 'Tools', price: 399, stock: 7 });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('rejects a product without a name', async () => {
    const res = await request(app).post('/products').send({ price: 100, stock: 1 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('name is required');
  });

  it('rejects a non-positive price', async () => {
    const res = await request(app).post('/products').send({ name: 'Free thing', price: 0, stock: 1 });
    expect(res.status).toBe(400);
  });

  it('rejects negative stock on POST, PUT, and PATCH', async () => {
    const postRes = await request(app)
      .post('/products')
      .send({ name: 'Test', category: 'Tools', price: 100, stock: -5 });

    expect(postRes.status).toBe(400);
    expect(postRes.body).toEqual({ errors: ['stock cannot be negative'] });

    const putRes = await request(app)
      .put('/products/1')
      .send({ id: 1, name: 'Claw hammer', category: 'Tools', price: 549, stock: -1 });

    expect(putRes.status).toBe(400);
    expect(putRes.body).toEqual({ errors: ['stock cannot be negative'] });

    const patchRes = await request(app).patch('/products/1').send({ stock: -1 });

    expect(patchRes.status).toBe(400);
    expect(patchRes.body).toEqual({ errors: ['stock cannot be negative'] });
  });

  it('allows stock of 0 on create', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Test', category: 'Tools', price: 100, stock: 0 });

    expect(res.status).toBe(201);
    expect(res.body.stock).toBe(0);
  });

  it('allows partial updates with PATCH', async () => {
    const res = await request(app).patch('/products/1').send({ stock: 20 });
    expect(res.status).toBe(200);
    expect(res.body.stock).toBe(20);
  });
});
