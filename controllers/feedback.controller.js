const { Feedback, sequelize } = require('../models');

/**
 * Controller untuk Fitur Mandiri (Bagian 2): Form Ulasan & Feedback Aman
 * Menerapkan:
 * 1. Validasi Server-Side (express-validator)
 * 2. Sanitasi Input (trim, escape, normalizeEmail)
 * 3. Escape HTML pada View EJS (<%= %>)
 * 4. Parameterized Query / ORM Sequelize
 */

// Menampilkan halaman feedback dan daftar ulasan
async function getFeedbackPage(req, res) {
  try {
    // 🛡️ Parameterized Query via Sequelize ORM
    const feedbacks = await Feedback.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.render('feedback', {
      username: req.session.username || 'Tamu',
      feedbacks,
      errors: [],
      success: null,
      old: {},
      sanitizedDiff: null,
    });
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).send('Terjadi kesalahan pada server');
  }
}

// Menangani submit feedback baru
async function postFeedback(req, res) {
  const rawData = req.rawBodyForDemo || req.body;
  const sanitizedData = {
    name: req.body.name,
    email: req.body.email,
    rating: req.body.rating,
    comment: req.body.comment,
  };

  // Cek apakah ada error dari validasi server-side
  if (req.validationErrors && req.validationErrors.length > 0) {
    try {
      const feedbacks = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
      return res.status(422).render('feedback', {
        username: req.session.username || 'Tamu',
        feedbacks,
        errors: req.validationErrors,
        success: null,
        old: rawData,
        sanitizedDiff: null,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Terjadi kesalahan pada server');
    }
  }

  try {
    // 🛡️ Parameterized Insert via Sequelize ORM (Aman dari SQL Injection)
    const newFeedback = await Feedback.create({
      name: sanitizedData.name,
      email: sanitizedData.email,
      rating: parseInt(sanitizedData.rating, 10),
      comment: sanitizedData.comment,
    });

    const feedbacks = await Feedback.findAll({ order: [['createdAt', 'DESC']] });

    return res.render('feedback', {
      username: req.session.username || 'Tamu',
      feedbacks,
      errors: [],
      success: 'Feedback / ulasan Anda berhasil disimpan dengan aman! 🎉',
      old: {},
      sanitizedDiff: {
        before: rawData,
        after: sanitizedData,
      },
    });
  } catch (err) {
    console.error('Error saving feedback:', err);
    const feedbacks = await Feedback.findAll({ order: [['createdAt', 'DESC']] }).catch(() => []);
    return res.status(500).render('feedback', {
      username: req.session.username || 'Tamu',
      feedbacks,
      errors: ['Gagal menyimpan data ke database: ' + err.message],
      success: null,
      old: rawData,
      sanitizedDiff: null,
    });
  }
}

module.exports = {
  getFeedbackPage,
  postFeedback,
};
