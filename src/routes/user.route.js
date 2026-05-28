const express = require("express");
const { healthCheck, registerUser, loginUser, addPicture, setProfile, getProfile, updateProfile } = require("../controllers/user.controller");
const verifyToken = require("../middlewares/auth");
const { upload_avatar } = require("../middlewares/upload");
const { validateLogin, validateRegister } = require("../validations/user.validations");
const router = express.Router();

router.get('/health', healthCheck);
router.post('/user/sign-up', validateRegister, registerUser);
router.post('/user/login', validateLogin, loginUser);
router.post('/user/add-avatar', verifyToken, upload_avatar.single("avatar"), addPicture);
router.post('/user/profile', verifyToken, setProfile);
router.get('/user/profile/:userId', verifyToken, getProfile);
router.patch('/user/profile/:userId', verifyToken, updateProfile);

module.exports = router;