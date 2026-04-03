import express from 'express';
const router = express.Router();

router.post('/verify', async (req, res) => {
  const { imageUrl } = req.body;

  // TEMP FAKE AI (we replace later)
  const result = {
    is_pothole: true,
    severity: 'moderate',
    confidence: 90
  };

  res.json(result);
});

export default router;