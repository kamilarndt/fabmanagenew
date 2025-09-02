const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.status(200).send('OK'));

app.get('/', (_req, res) => {
    res.json({ status: 'ok', service: 'fabryka-backend' });
});

// Concept → Miro board mock creator
app.post('/api/concept/miro/boards', (req, res) => {
    const id = `miro-${Math.random().toString(36).slice(2, 10)}`;
    const projectId = req.body?.projectId || 'unknown';
    const url = `https://miro.com/app/board/${id}/?embed=true&project=${encodeURIComponent(projectId)}`;
    res.json({ id, url });
});

// Materials list (mock)
app.get('/api/materials', (_req, res) => {
    const materials = [
        { id: 'mat-001', category: 'Płyty', name: 'MDF 18mm', unit: 'm2', unitCost: 82.5 },
        { id: 'mat-002', category: 'Płyty', name: 'Sklejka 12mm', unit: 'm2', unitCost: 94.2 },
        { id: 'mat-003', category: 'Metal', name: 'Profil alu 20x20', unit: 'mb', unitCost: 18.9 },
        { id: 'mat-004', category: 'Wykończenie', name: 'Fornir dębowy', unit: 'm2', unitCost: 120.0 },
        { id: 'mat-005', category: 'Farby', name: 'Lakier poliuretan', unit: 'l', unitCost: 65.0 }
    ];
    res.json(materials);
});

// Estimate → return a minimal PDF
app.post('/api/estimate', (req, res) => {
    const payload = req.body || {};
    const title = `ESTIMATE ${payload?.projectId || ''}`;

    const pdf = [
        '%PDF-1.3',
        '1 0 obj',
        '<< /Type /Catalog /Pages 2 0 R >>',
        'endobj',
        '2 0 obj',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        'endobj',
        '3 0 obj',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
        'endobj',
        '4 0 obj',
        '<< /Length 65 >>',
        'stream',
        'BT /F1 24 Tf 36 100 Td (' + title.replace(/[()]/g, '') + ') Tj ET',
        'endstream',
        'endobj',
        '5 0 obj',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        'endobj',
        'xref',
        '0 6',
        '0000000000 65535 f ',
        '0000000010 00000 n ',
        '0000000060 00000 n ',
        '0000000116 00000 n ',
        '0000000260 00000 n ',
        '0000000365 00000 n ',
        'trailer',
        '<< /Size 6 /Root 1 0 R >>',
        'startxref',
        '430',
        '%%EOF'
    ].join('\n');

    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdf, 'utf8'));
});

app.listen(PORT, () => {
    console.log(`Backend listening on :${PORT}`);
});


