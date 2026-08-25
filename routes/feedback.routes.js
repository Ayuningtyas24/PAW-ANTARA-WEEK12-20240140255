const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth.middleware');
const {
  feedbackValidationRules,
  handleValidationErrors,
} = require('../middlewares/validators');
const feedbackController = require('../controllers/feedback.controller');

// Snapshot raw body sebelum express-validator melakukan sanitasi
function captureRawBody(req, res, next) {
  req.rawBodyForDemo = { ...req.body };
  next();
}

// Halaman Feedback & Ulasan (Bagian 2 - Implementasi Mandiri)
router.get('/feedback', requireAuth, feedbackController.getFeedbackPage);
router.post(
  '/feedback',
  requireAuth,
  captureRawBody,
  feedbackValidationRules,
  handleValidationErrors,
  feedbackController.postFeedback
);

module.exports = router;
