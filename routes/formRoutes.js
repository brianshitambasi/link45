const express = require('express');
const { submitForm, getSubmissions } = require('../controllers/formController');
const { auth, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .post(upload.single('uploadedFile'), submitForm)
  .get(auth, authorizeRoles('admin'), getSubmissions);

module.exports = router;