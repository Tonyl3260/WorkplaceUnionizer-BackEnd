const { login, signup, me } = require('../controller/userController')

const router = require('express').Router()

router.route('/login').post(login)
router.route('/signup').post(signup)
router.route('/me').get(me)

module.exports = router