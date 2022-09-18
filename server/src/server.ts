import express from 'express';

const PORT = process.env.PORT || 3333;

const app = express();

app.get('/games', (req, res) => {
  res.json([]);
});

app.post('/ads', (req, res) => {
  res.status(201).json({});
});

app.get('/games/:id/ads', (req, res) => {
  const gameId = req.params.id;

  res.json({});
});

app.get('/ads/:id/discord', (req, res) => {
  const adId = req.params.id;

  res.json({});
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
