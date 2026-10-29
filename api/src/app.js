import jsonServer from 'json-server';
import { validateProduct } from './validate.js';

/**
 * Builds the API. `db` can be a file path (persists changes) or a plain
 * object (in-memory, used by tests).
 */
export function createApp(db) {
  const server = jsonServer.create();
  const router = jsonServer.router(db);

  server.use(jsonServer.defaults({ logger: false }));
  server.use(jsonServer.bodyParser);

  server.get('/health', (req, res) => res.json({ status: 'ok' }));
  server.use('/products', validateProduct);
  server.use(router);

  return server;
}
