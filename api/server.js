import { createApp } from './src/app.js';

const port = Number(process.env.PORT || 3001);
const dbFile = process.env.DB_FILE || 'db.json';

createApp(dbFile).listen(port, () => {
  console.log(`Store API running on http://localhost:${port} (db: ${dbFile})`);
});
