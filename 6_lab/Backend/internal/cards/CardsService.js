const { CardDAO } = require('./CardsDAO');

class CardsService {
  static getAll() { return CardDAO.find().map(c => c.toJSON()); }
  static getById(id) { return CardDAO.findById(id).toJSON(); }
  static create(data) { return CardDAO.insert(data).toJSON(); }
  static remove(id) { CardDAO.delete(id); }
}

module.exports = { CardsService };