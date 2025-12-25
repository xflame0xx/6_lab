const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;
const DATA_FILE = path.join(__dirname, 'cards.json');

app.use(cors());
app.use(express.json());

// Чтение данных
function readCards() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Запись данных
function writeCards(cards) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(cards, null, 2));
}

// GET /cards — получить все карточки
app.get('/cards', (req, res) => {
  res.json(readCards());
});

// POST /cards — добавить карточку
app.post('/cards', (req, res) => {
  const cards = readCards();
  const newCard = {
    id: Date.now(), // уникальный ID
    ...req.body
  };
  cards.push(newCard);
  writeCards(cards);
  res.status(201).json(newCard);
});

// DELETE /cards/:id — удалить карточку
app.delete('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let cards = readCards();
  const initialLength = cards.length;
  cards = cards.filter(card => card.id !== id);
  
  if (cards.length === initialLength) {
    return res.status(404).json({ error: 'Карточка не найдена' });
  }
  
  writeCards(cards);
  res.status(204).end();
});

// PUT /cards/:id — обновить карточку
app.put('/cards/:id', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    let cards = JSON.parse(data);
    const id = parseInt(req.params.id);
    
    const index = cards.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Карточка не найдена' });
    }

    // Обновляем только разрешённые поля
    const allowedFields = ['first_name', 'last_name', 'role', 'city'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        cards[index][field] = req.body[field];
      }
    });

    // Обновляем время последнего входа при редактировании
    cards[index].last_seen = { time: Math.floor(Date.now() / 1000) };

    fs.writeFileSync(DATA_FILE, JSON.stringify(cards, null, 2));
    res.json(cards[index]);
  } catch (err) {
    console.error('Ошибка обновления:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
app.listen(PORT, () => {
  console.log(`✅ Бэкенд запущен: http://localhost:${PORT}`);
});