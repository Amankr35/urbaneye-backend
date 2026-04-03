import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reportRoutes from './routes/reports.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ FIRST: middleware
app.use(cors());
app.use(express.json());

// ✅ THEN routes
app.use('/api/reports', reportRoutes);

// test route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pothole API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});