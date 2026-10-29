const BASE = '/api';

async function handle(res) {
  if (res.ok) return res.status === 204 ? null : res.json();
  let message = `Request failed (${res.status})`;
  try {
    const body = await res.json();
    if (body.errors) message = body.errors.join(', ');
  } catch {
    /* response had no JSON body */
  }
  throw new Error(message);
}

export const api = {
  listProducts: () => fetch(`${BASE}/products`).then(handle),
  createProduct: (product) =>
    fetch(`${BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }).then(handle),
  deleteProduct: (id) => fetch(`${BASE}/products/${id}`, { method: 'DELETE' }).then(handle),
};
