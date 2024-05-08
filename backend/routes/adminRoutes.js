const { Router } = require('express')

const userController = require('../controllers/adminController')

const router = Router()


const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), userController.cv_grader)


module.exports = router