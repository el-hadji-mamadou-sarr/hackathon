const router = require('express').Router();
const tokenController = require('../controllers/tokenController');

router.post("/createToken", tokenController.createToken);
router.post('/validateHash', tokenController.validateHash)
module.exports = router