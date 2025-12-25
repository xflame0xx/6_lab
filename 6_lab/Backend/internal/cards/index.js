const express = require('express');
const { CardsController } = require('./CardsController');

const router = express.Router();

router.get('/', CardsController.getAll);
router.get('/:id', CardsController.getById);
router.post('/', CardsController.create);
router.delete('/:id', CardsController.delete);

module.exports = router;