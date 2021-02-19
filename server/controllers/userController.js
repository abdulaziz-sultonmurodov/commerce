const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken')
const User = require('../models/userModel');


// @desc   Auth user & get token 
// @route   POST /users/login
// @access   Public

const authUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body

    const user = await User.findOne({ email })

    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Elektron Manzil yoki Parol noto\'g\'ri kiritldi.')
    }
})

// @desc   Register a new user 
// @route   POST /users
// @access   Public

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
 
     const userExists = await User.findOne({ email })
 
    if(userExists) {
        res.status(400)
        throw new Error('Foydalanuvchi Allaqachon Mavjud')
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error("Foydalanuvchi ma\'lumoti Noto\'g\'ri")
    }
 })


// @desc   Get User Profile
// @route   GET /users/profile
// @access   Private

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('Foydalanuvchi Topilmadi')
    }
})

// @desc   Update User Profile
// @route   PUT /users/profile
// @access   Private

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if(req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        })

    } else {
        res.status(404)
        throw new Error('Foydalanuvchi Topilmadi')
    }
})


// @desc   Get all users
// @route   GET /users
// @access   Private/Admin

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)

})

// @desc   Delete user 
// @route   DELETE /users/:id
// @access   Private/Admin

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    
    if(user){
        await user.remove()
        res.json({ message: 'Foydalanuvchi o\'chirildi' })
    } else {
        res.status(404)
        throw new Error('Foydalanuvchi topilmadi')
    }

})

// @desc   Get user by ID
// @route   GET /users/:id
// @access   Private/Admin

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if(user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('Foydalanuvchi topilmadi')
    }


})

// @desc   Update User 
// @route   PUT /users/:id
// @access   Private/Admin

const updateUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)

    if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin || user.isAdmin

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })

    } else {
        res.status(404)
        throw new Error('Foydalanuvchi Topilmadi')
    }
})


module.exports = { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser }