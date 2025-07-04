const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate-qr', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Texto requerido' });
  }

  try {
    const qrBuffer = await QRCode.toBuffer(text, {
      type: 'png',
      width: 300,
    });

    res.set('Content-Type', 'image/png');
    res.send(qrBuffer);
  } catch (err) {
    console.error('Error al generar QR:', err);
    res.status(500).json({ error: 'No se pudo generar el código QR' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
