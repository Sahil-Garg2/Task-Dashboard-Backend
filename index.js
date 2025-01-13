const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { resolve } = require('path');
const dotenv = require('dotenv');
const Role = require('./models/role');
// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const taskRoutes = require('./routes/taskRoutes');
const roleRoutes = require('./routes/roleRoutes');
const checklist = require('./routes/checkListRoute');

const app = express();
const port = 3010;
dotenv.config();
// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(express.static('static'));

mongoose
  .connect('mongodb+srv://sahilgarg99912:kZ8dXtaHvezRmrAU@cluster0.jq62e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error: ', err));


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/checklist', checklist);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
