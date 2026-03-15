require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const { initDB } = require('./db/db');
const taskRoutes = require('./routes/tasks');

const app  = express();
const PORT = process.env.PORT || 3002;

// ── Middleware ──
app.use(cors());
app.use(express.json());

morgan.token('body-size', (req) => {
  return req.body ? JSON.stringify(req.body).length + 'b' : '0b';
});
app.use(morgan(':method :url :status :response-time ms - body::body-size', {
  stream: { write: (msg) => console.log(msg.trim()) }
}));

// ── Routes ──
app.use('/api/tasks', taskRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found', path: req.path }));
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ── Start ──
async function start() {
  let retries = 10;
  while (retries > 0) {
    try { await initDB(); break; }
    catch (err) { 
        retries--; 
        console.log(`[task-service] Waiting for DB... (${retries} retries left)`);
        await new Promise(r => setTimeout(r, 3000)); 
    }
  }
  app.listen(PORT, () => console.log(`🚀 [Task-Service] Running on port ${PORT}`));
}

start();