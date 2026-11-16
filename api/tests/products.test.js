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

  it('creates a valid product without reorder level', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Spirit level', category: 'Tools', price: 399, stock: 7 });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.reorderLevel).toBeUndefined();
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

  it('replaces a product without reorder level', async () => {
    const res = await request(app)
      .put('/products/1')
      .send({ name: 'Claw hammer', category: 'Tools', price: 549, stock: 18 });

    expect(res.status).toBe(200);
    expect(res.body.reorderLevel).toBeUndefined();
  });

  it('allows partial updates with PATCH', async () => {
    const res = await request(app).patch('/products/1').send({ stock: 20 });
    expect(res.status).toBe(200);
    expect(res.body.stock).toBe(20);
  });

  it('accepts a non-negative integer reorder level on POST', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Spirit level', category: 'Tools', price: 399, stock: 7, reorderLevel: 0 });

    expect(res.status).toBe(201);
    expect(res.body.reorderLevel).toBe(0);
  });

  it('accepts a non-negative integer reorder level on PUT', async () => {
    const res = await request(app)
      .put('/products/1')
      .send({ name: 'Claw hammer', category: 'Tools', price: 549, stock: 18, reorderLevel: 4 });

    expect(res.status).toBe(200);
    expect(res.body.reorderLevel).toBe(4);
  });

  it('accepts a non-negative integer reorder level on PATCH', async () => {
    const res = await request(app).patch('/products/1').send({ reorderLevel: 2 });

    expect(res.status).toBe(200);
    expect(res.body.reorderLevel).toBe(2);
  });

  it('rejects a negative reorder level', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Spirit level', category: 'Tools', price: 399, stock: 7, reorderLevel: -1 });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('reorderlevel must be a non-negative integer');
  });

  it('rejects a non-integer reorder level on PUT', async () => {
    const res = await request(app)
      .put('/products/1')
      .send({ name: 'Claw hammer', category: 'Tools', price: 549, stock: 18, reorderLevel: 2.5 });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('reorderlevel must be a non-negative integer');
  });

  it('rejects a non-integer reorder level on PATCH', async () => {
    const res = await request(app).patch('/products/1').send({ reorderLevel: 2.5 });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('reorderlevel must be a non-negative integer');
  });
});
