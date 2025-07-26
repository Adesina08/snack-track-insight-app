import express from 'express';
// Firebase push notifications disabled
const app = express();
const PORT = process.env.PORT || 4000;
// Push token management disabled
app.use(express.json());
// Push registration endpoints and cron job removed
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
