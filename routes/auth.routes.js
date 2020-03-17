const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const config = require('config')

const router = new Router
// /api/auth
router.post(
    '/register',
    [
        check('email', 'Wrong email').isEmail(),
        check('password', 'Password must be at least 6 symbols').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.array(),
                    message: 'Validation errors'
                })
            }

            const { email, password } = req.body

            const candidate = await User.findOne({ email })

            if(candidate) {
                res.status(422).json({ message: 'User with email already exists' })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({ email, password: hashedPassword })
            
            await user.save()

            res.status(201).json({ message: 'User created!' })

        } catch (e) {
            res.status(500).json({ message: 'Server error!' })
        }
})

router.post(
    '/login',
    [
        check('email', 'Wrong email').isEmail(),
        check('password', 'Password must be at least 6 symbols').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
    
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.array(),
                    message: 'Validation errors'
                })
            }
    
            const { email, password } = req.body
    
            const user = await User.findOne({ email })
    
            if(!user) {
                res.status(422).json({ message: 'User doesnt exist' })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(422).json({ message: 'Wrong password, try again' })
            }
    
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.status(200).json({ token, userId: user.id })
    
        } catch (e) {
            res.status(500).json({ message: 'Error!' })
        }
    
})

module.exports = router