import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para agregar https:// si falta en un link simple
  const formatLink = (input) => {
    if (
      input.startsWith('http://') ||
      input.startsWith('https://')
    ) {
      return input;
    }
    if (input.includes('.') && !input.includes(' ')) {
      return 'https://' + input;
    }
    return input;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const textoFormateado = formatLink(text);

    setLoading(true);
    setQrImageUrl(null);

   try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/generate-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textoFormateado }),
    });

      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setQrImageUrl(imageUrl);

      // Confeti al generar QR
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    } catch (err) {
      alert('Error generando el QR desde el backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrImageUrl) return;
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = 'codigo_qr.png';
    link.click();
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="p-4 shadow-lg rounded bg-light">
            <h2 className="text-center mb-4">✨ Generador de Código QR</h2>
            <Form onSubmit={handleGenerate}>
              <Form.Group>
                <Form.Label>Introduce un texto</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej. https://tupagina.com"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3 w-100">
                Generar QR
              </Button>
            </Form>

            {loading && (
              <div className="text-center mt-4">
                <Spinner animation="border" role="status" />
                <p>Generando...</p>
              </div>
            )}

            {qrImageUrl && (
              <motion.div
                className="text-center mt-5"
                initial={{ opacity: 0, rotateY: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <img
                  src={qrImageUrl}
                  alt="Código QR"
                  width={256}
                  className="rounded shadow"
                />
                <div className="mt-3">
                  <Button variant="success" onClick={handleDownload}>
                    Descargar QR
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default QRCodeGenerator;
