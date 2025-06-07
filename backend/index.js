import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/lib/db.js';
import authRouter from './src/routes/auth.js';
import msgRouter from './src/routes/message.js';
import cors from 'cors';
import { app, server } from './src/lib/socket.js';

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

// This middleware is utilized for authentication & authorization task.
app.use('/api/auth', authRouter);
app.use('/api/messages', msgRouter);

server.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
    connectDB();
})