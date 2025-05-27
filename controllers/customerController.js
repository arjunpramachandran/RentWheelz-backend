const User = require('../models/User')
const bcrypt = require('bcrypt')
const createToken = require('../utils/generateToken')
const Review = require('../models/Review')
const { cloudinaryInstance } = require('../config/cloudinary')


//REGISTER

const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, role, licenseNumber, profilepic, licenseProof, addressProof } = req.body || {}
        const file = req.files || {}

        if (!name || !email || !password || !phone ||
            (role === "customer" && (!licenseNumber || !file.licenseProof)) ||
            (role !== "admin" && !file.addressProof)) {
            return res.status(400).json({ error: "All Fields are Required" })
        }
        const userExistsEmail = await User.findOne({ email })
        if (userExistsEmail) return res.status(400).json({ error: 'User Already Exists with same email ID' })

        const userExistsPhone = await User.findOne({ phone })
        if (userExistsPhone) return res.status(400).json({ error: 'User Already Exists with Same Phone Number' })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        if (file.profilepic) {
            var uploadProfilepic = await cloudinaryInstance.uploader.upload(file.profilepic[0].path)
        }

        if (file.licenseProof) {
            var uploadlicense = await cloudinaryInstance.uploader.upload(file.licenseProof[0].path)
        }
        if (file.addressProof) {
            var uploadaddress = await cloudinaryInstance.uploader.upload(file.addressProof[0].path)
        }

       


        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            licenseNumber: role !== "customer" ? null : licenseNumber,
            profilepic: uploadProfilepic?.url || null,
            licenseProof: uploadlicense?.url || null,
            addressProof: uploadaddress?.url || null
        })

        const savedUser = await newUser.save()

        const userData = savedUser.toObject()
        delete userData.password
        res.status(201).json({ message: 'Account Created ', userData })





    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}


// LOGIN 


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {}

        if (!email || !password) {
            return res.status(400).json({ error: "All Fields are Required" })
        }
        const userExists = await User.findOne({ email })
        if (!userExists) return res.status(400).json({ error: 'Customer Not Found' })

        const passwordMatch = await bcrypt.compare(password, userExists.password)
        if (!passwordMatch) return res.status(400).json({ error: "Invalid Password" })

        const token = createToken(userExists._id, userExists.role)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'production',
            sameSite: 'strict',
            //maxAge: 3 * 24 * 60 * 60 * 1000 
        });

        const userObject = userExists.toObject()
        delete userObject.password

        return res.status(200).json({ message: "Login succesfull", userObject })



    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}

const profile = async (req, res, next) => {
    try {

        const userId = req.user.id
        const userData = await User.findById(userId).select('-password')
        if (!userData) return res.status(400).json({ error: 'Customer Not Found' })
        const userObject = userData.toObject()
        delete userObject.password
        return res.status(200).json({ message: "Profile Retrieved", userObject })




    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}

const logout = async (req, res, next) => {
    try {
        res.clearCookie('token')
        res.status(200).json({ message: "Logout Successfull" })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })

    }
}

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id


        const { name, email, phone, licenseNumber, addressProof, profilepic } = req.body || {}



        if (email) {
            userExistsEmail = await User.findOne({ email })
            if (userExistsEmail) return res.status(400).json({ error: 'User Already Exists with same email ID' })
        }

        if (phone) {
            const userExistsPhone = await User.findOne({ phone })
            if (userExistsPhone) return res.status(400).json({ error: 'User Already Exists with Same PhoneNumber' })
        }

        // Password Update
        // const salt = await bcrypt.genSalt(10)
        // const hashedPassword = await bcrypt.hash(password,salt)


        const updatedUser = await User.findByIdAndUpdate(userId, { name, email, phone, licenseNumber, addressProof, profilepic }, { new: true }).select('-password')


        if (!updatedUser) return res.status(400).json({ error: 'Customer Not Found' })
        res.status(201).json({ message: 'Profile Updated ', updatedUser })
    }
    catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}
const UpdatePassword = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { oldPassword, newPassword } = req.body || {}

        if (!oldPassword || !newPassword) return res.status(400).json({ error: "All Fields are Required" })

        const user = await User.findById(userId)
        if (!user) return res.status(400).json({ error: 'Customer Not Found' })

        const passwordMatch = await bcrypt.compare(oldPassword, user.password)
        if (!passwordMatch) return res.status(400).json({ error: "Invalid Old Password" })

        const salt = await bcrypt.genSalt(10)
        const hashedNewPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedNewPassword
        await user.save()

        res.status(200).json({ message: "Password Updated Successfully" })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}
const addReview = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { rating, comment } = req.body || {}
        if (!rating || !comment) return res.status(400).json({ error: "All Fields are Required" })

        const review = new Review({ userId, rating, comment })
        const savedReview = await review.save()

        res.status(201).json({ message: "Review Added", savedReview })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}


const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
        if (!reviews) return res.status(404).json({ message: "No reviews found" })
        res.status(200).json({ message: "Reviews retrieved successfully", reviews })


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })

    }
}
const deleteMyReview = async (req, res) => {
    try {
        const reviewId = req.params.id
        const userId = req.user.id

        const review = await Review.findById(reviewId)
        if (!review) return res.status(404).json({ message: "Review not found" })
        if (review.userId.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this review" })
        }
        await Review.findByIdAndDelete(reviewId)
        res.status(200).json({ message: "Review deleted successfully" })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { register, login, profile, logout, updateProfile, UpdatePassword, addReview, getAllReviews, deleteMyReview };