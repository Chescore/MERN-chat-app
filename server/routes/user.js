const express = require('express');
const router = express.Router();
const { catchErrors } = require('../middleware/errorHandler');
const user = require('../controllers/user');

router.post('/login', catchErrors(user.login));
router.post('/register',catchErrors(user.register));

module.exports = router;