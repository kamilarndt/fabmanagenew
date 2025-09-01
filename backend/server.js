const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/health', (_req, res) => res.status(200).send('OK'));

app.get('/', (_req, res) => {
    res.json({ status: 'ok', service: 'fabryka-backend' });
});

app.listen(PORT, () => {
    console.log(`Backend listening on :${PORT}`);
});


