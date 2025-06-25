const User = require('../models/User')
const bcrypt = require('bcrypt')
const createToken = require('../utils/generateToken')
const Review = require('../models/Review')
const { cloudinaryInstance } = require('../config/cloudinary')


//REGISTER

const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, role, licenseNumber, addressProofId } = req.body || {}
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
        const userExistsLicense = await User.findOne({ licenseNumber })
        if (userExistsLicense && role === "customer") return res.status(400).json({ error: 'User Already Exists with Same License Number' })
        const userExistsAddressProof = await User.findOne({ addressProofId })
        if (userExistsAddressProof) return res.status(400).json({ error: 'User Already Exists with Same Address Proof' })

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
            addressProofId: role === "admin" ? null : addressProofId,
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
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
            maxAge: 24 * 60 * 60 * 1000
        });

        const userObject = userExists.toObject()
        delete userObject.password

        return res.status(200).json({ message: "Login succesfull", userObject })



    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}

// Check User
const checkUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(401).json({ message: 'User not found' });
        res.status(200).json({ user });
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

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

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phone, licenseNumber, addressProofId } = req.body || {};
        const file = req.files || {};

        console.log('Request body:', req.body);
        console.log('Uploaded files:', req.files);

        if (email) {
            const userExistsEmail = await User.findOne({ email, _id: { $ne: userId } });
            if (userExistsEmail)
                return res.status(400).json({ error: 'User already exists with the same email' });
        }


        if (phone) {
            const userExistsPhone = await User.findOne({ phone, _id: { $ne: userId } });
            if (userExistsPhone)
                return res.status(400).json({ error: 'User already exists with the same phone number' });
        }


        let profilepicUrl = null,
            licenseProofUrl = null,
            addressProofUrl = null;

        if (file.profilepic) {
            const uploaded = await cloudinaryInstance.uploader.upload(file.profilepic[0].path);
            profilepicUrl = uploaded.secure_url;
        }

        if (file.licenseProof) {
            const uploaded = await cloudinaryInstance.uploader.upload(file.licenseProof[0].path);
            licenseProofUrl = uploaded.secure_url;
        }

        if (file.addressProof) {
            const uploaded = await cloudinaryInstance.uploader.upload(file.addressProof[0].path);
            addressProofUrl = uploaded.secure_url;
        }


        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const updates = {
            ...(name && { name }),
            ...(email && { email }),
            ...(phone && { phone }),
            ...(profilepicUrl && { profilepic: profilepicUrl }),
            ...(licenseProofUrl && { licenseProof: licenseProofUrl }),
            ...(addressProofUrl && { addressProof: addressProofUrl }),
        };


        if (user.role === 'customer') {
            updates.licenseNumber = licenseNumber || user.licenseNumber;
            updates.addressProofId = addressProofId || user.addressProofId;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
            select: '-password'
        });

        res.status(200).json({ message: 'Profile updated successfully', updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

const UpdatePassword = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { oldpassword, newpassword } = req.body || {}

        if (!oldpassword || !newpassword) return res.status(400).json({ error: "All Fields are Required" })

        const user = await User.findById(userId)
        if (!user) return res.status(400).json({ error: 'Customer Not Found' })

        const passwordMatch = await bcrypt.compare(oldpassword, user.password)
        if (!passwordMatch) return res.status(400).json({ error: "Invalid Old Password" })

        const salt = await bcrypt.genSalt(10)
        const hashedNewPassword = await bcrypt.hash(newpassword, salt)

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
        const reviews = await Review.find().populate('userId', 'name profilepic role') // Populate userId with name and profilepic
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

module.exports = { register, login, checkUser, profile, logout, updateProfile, UpdatePassword, addReview, getAllReviews, deleteMyReview };