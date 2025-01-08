const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { resolve } = require('path');
const dotenv = require('dotenv');
// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = 3010;
dotenv.config();
// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(express.static('static'));

mongoose
  .connect('mongodb://localhost:27017/task-management-system', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error: ', err));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
