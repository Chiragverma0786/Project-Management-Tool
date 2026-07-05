const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const express = require('express');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const projectRoute = require('./routes/projectRoute');
const taskRoute = require('./routes/taskRoute');
const errorMiddleware = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Routes Working');
});

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/projects', projectRoute);
app.use('/api/tasks', taskRoute);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on PORT:', PORT);
});