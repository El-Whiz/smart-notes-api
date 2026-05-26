const express = require('express');
const verifyToken = require('../middlewares/auth');
const { upload_file } = require('../middlewares/upload');
const {
  getAllUserNotes,
  getSingleUserNote,
  generateFromText,
  generateFromDoc,
  generateFromAudio,
  generateFromLink,
  deleteNote,
} = require('../controllers/note.controller');

const router = express.Router();

router.post('/notes/generate/text', verifyToken, generateFromText);
router.post('/notes/generate/document', verifyToken, upload_file.single('file'), generateFromDoc);
router.post('/notes/generate/audio', verifyToken, upload_file.single('file'), generateFromAudio);
router.post('/notes/generate/link', verifyToken, generateFromLink);
router.get('/notes/:userId', verifyToken, getAllUserNotes);
router.get('/notes/:userId/:noteId', verifyToken, getSingleUserNote);
router.delete('/notes/:userId/:noteId', verifyToken, deleteNote);

module.exports = router;
