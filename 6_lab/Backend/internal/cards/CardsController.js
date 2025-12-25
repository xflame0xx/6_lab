const { CardsService } = require('./CardsService');

class CardsController {
  static getAll(req, res) { res.json(CardsService.getAll()); }
  
  static getById(req, res) {
    try { res.json(CardsService.getById(req.params.id)); }
    catch (e) { res.status(404).json({ error: e.message }); }
  }

  static create(req, res) {
    try { res.status(201).json(CardsService.create(req.body)); }
    catch (e) { res.status(400).json({ error: e.message }); }
  }

  static delete(req, res) {
    try { 
      CardsService.remove(req.params.id); 
      res.status(204).end(); 
    }
    catch (e) { res.status(404).json({ error: e.message }); }
  }
}

module.exports = { CardsController };