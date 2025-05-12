const express = require('express');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');
const XLSX = require('xlsx');
const path = require('path');

// Load Excel data
const workbook = XLSX.readFile(path.join(__dirname, '../data/Pregnancy_Craving_Food_Swap.xlsx'));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const foods = XLSX.utils.sheet_to_json(sheet);

// Get all foods for auto-suggestions
router.get('/foods', (req, res) => {
  const foodNames = foods.map(food => food['Craved Food']);
  res.json(foodNames);
});

// Get food details
router.get('/foods/:name', (req, res) => {
  const food = foods.find(f => f['Craved Food'].toLowerCase() === req.params.name.toLowerCase());
  if (!food) {
    return res.status(404).json({ message: 'No alternative food available for this craving.' });
  }
  res.json(food);
});

// Save search
router.post('/search', async (req, res) => {
  const { userId, food } = req.body;
  const search = new SearchHistory({ userId, food });
  await search.save();
  res.json({ message: 'Search saved' });
});

// Get search history
router.get('/search-history', async (req, res) => {
  const { userId } = req.query;
  const history = await SearchHistory.find({ userId }).sort({ timestamp: -1 });
  res.json(history);
});

module.exports = router;