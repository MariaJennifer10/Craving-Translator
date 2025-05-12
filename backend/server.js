const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const XLSX = require('xlsx');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Load Excel file
let foods = [];
try {
  const workbook = XLSX.readFile('./data/Pregnancy_Craving_Food_Swap.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  foods = XLSX.utils.sheet_to_json(sheet);
  console.log(`Excel file loaded successfully: ${foods.length} foods found`);
} catch (err) {
  console.error('Error loading Excel file:', err);
}

// MongoDB schema for search history
const searchSchema = new mongoose.Schema({
  userId: String,
  food: String,
  timestamp: { type: Date, default: Date.now },
});
const Search = mongoose.model('Search', searchSchema);

// API endpoints
// Get list of food names for suggestions
app.get('/api/foods', (req, res) => {
  const foodNames = foods.map(food => food['Craved Food']);
  res.json(foodNames);
});

// Get details for a specific food
app.get('/api/foods/:food', (req, res) => {
  const food = foods.find(f => f['Craved Food'] === req.params.food);
  if (food) {
    res.json(food);
  } else {
    res.status(404).json({ message: 'Food not found' });
  }
});

// Save search to history
app.post('/api/search', async (req, res) => {
  try {
    const { userId, food } = req.body;
    const search = new Search({ userId, food });
    await search.save();
    res.status(201).json({ message: 'Search saved' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving search', error: err });
  }
});

// Get search history for a user
app.get('/api/search-history', async (req, res) => {
  try {
    const { userId } = req.query;
    const history = await Search.find({ userId }).sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history', error: err });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));