const fs = require('fs');
const path = require('path');

class CardsRepository {
  static dbPath = path.join(__dirname, '../../db/cards.json');

  static read() {
    return JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
  }

  static write(data) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }
}

module.exports = { CardsRepository };