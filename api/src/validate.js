const WRITE_METHODS = ['POST', 'PUT', 'PATCH'];

/**
 * Validates product payloads before json-server persists them.
 * PATCH only validates the fields that are present.
 */
export function validateProduct(req, res, next) {
  if (!WRITE_METHODS.includes(req.method)) return next();

  const body = req.body ?? {};
  const partial = req.method === 'PATCH';
  const errors = [];

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim() === '') {
      errors.push('name is required');
    }
  }

  if (!partial || body.price !== undefined) {
    if (typeof body.price !== 'number' || body.price <= 0) {
      errors.push('price must be a positive number');
    }
  }

  if (!partial || body.stock !== undefined) {
    if (!Number.isInteger(body.stock)) {
      errors.push('stock must be an integer');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  return next();
}
