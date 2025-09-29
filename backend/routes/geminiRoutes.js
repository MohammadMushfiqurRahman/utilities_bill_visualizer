const express = require('express');
const router = express.Router();
const https = require('https');

router.post('/v1beta/models/gemini-1.5-flash:generateContent', (req, res) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured on the server.' });
  }

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: '/v1beta/models/gemini-1.5-flash:generateContent',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': geminiApiKey,
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, {
      end: true,
    });
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy request error:', err);
    res.status(500).json({ error: 'Failed to proxy request to Gemini API.' });
  });

  proxyReq.write(JSON.stringify(req.body));
  proxyReq.end();
});

module.exports = router;
