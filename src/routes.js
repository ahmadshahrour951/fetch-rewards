const express = require('express');
const router = express.Router();

router.post('/add', (req, res, next) => {});
router.patch('/spend', (req, res, next) => {});
router.get('/balance', (req, res, next) => {});
router.use((error, req, res, next) => {});
router.use((req, res, next) => {});

module.exports = router;
