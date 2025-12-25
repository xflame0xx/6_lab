const { CardsRepository } = require('./CardsRepository');

class CardDAO {
  constructor(id, first_name, last_name, photo_400, role, city, mobile_phone, sex, last_seen) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.photo_400 = photo_400;
    this.role = role;
    this.city = city;
    this.mobile_phone = mobile_phone;
    this.sex = sex;
    this.last_seen = last_seen;
  }

  static _validateId(id) {
    const num = Number(id);
    if (isNaN(num) || num <= 0) throw new Error('ID must be a positive number');
    return num;
  }

  static find() {
    return CardsRepository.read().map(c => new this(
      c.id, c.first_name, c.last_name, c.photo_400, c.role, c.city, c.mobile_phone, c.sex, c.last_seen
    ));
  }

  static findById(id) {
    const numId = this._validateId(id);
    const card = CardsRepository.read().find(c => c.id === numId);
    if (!card) throw new Error('Card not found');
    return new this(
      card.id, card.first_name, card.last_name, card.photo_400, card.role, card.city, card.mobile_phone, card.sex, card.last_seen
    );
  }

  static insert(data) {
    const { id, first_name, last_name, photo_400, role, city = {}, mobile_phone = '', sex = 0, last_seen = { time: Math.floor(Date.now()/1000) } } = data;
    if (!id || !first_name || !last_name) throw new Error('Missing required fields');
    
    const cards = CardsRepository.read();
    if (cards.some(c => c.id === id)) throw new Error('ID already exists');
    
    const newCard = { id, first_name, last_name, photo_400, role, city, mobile_phone, sex, last_seen };
    cards.push(newCard);
    CardsRepository.write(cards);
    return new this(id, first_name, last_name, photo_400, role, city, mobile_phone, sex, last_seen);
  }

  static delete(id) {
    const numId = this._validateId(id);
    const cards = CardsRepository.read();
    const filtered = cards.filter(c => c.id !== numId);
    if (filtered.length === cards.length) throw new Error('Card not found');
    CardsRepository.write(filtered);
    return filtered.map(c => new this(
      c.id, c.first_name, c.last_name, c.photo_400, c.role, c.city, c.mobile_phone, c.sex, c.last_seen
    ));
  }

  toJSON() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      photo_400: this.photo_400,
      role: this.role,
      city: this.city,
      mobile_phone: this.mobile_phone,
      sex: this.sex,
      last_seen: this.last_seen
    };
  }
}

module.exports = { CardDAO };