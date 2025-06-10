// src/app.js
import express from 'express';
import pool from './config/db.js';
import cors from "cors";
import helmet from "helmet";
import morgan from 'morgan';
import dotenv from "dotenv"
import authRoutes from './routes/auth-route.js'; 


const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(helmet())

app.use('/api/auth', authRoutes);

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.send(`Server is running. DB time: ${result.rows[0].now}`);
});

export default app;