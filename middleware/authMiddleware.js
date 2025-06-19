const jwt = require('jsonwebtoken')

// for all users
const authUser = (req, res, next) => {
    try {
       
        const token = req.cookies?.token;

        if (!token) return res.status(401).json({ message: "User not authorised" });

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decodedToken) return res.status(401).json({ message: "Invalid token" });

        req.user = decodedToken;
        next();


    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });

    }
}
// for admin
const authAdmin = (req, res, next) => {
    try {
       const token = req.cookies?.token;

        if (!token) return res.status(401).json({ message: "User not authorised" });

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decodedToken) return res.status(401).json({ message: "Invalid token" });


        if (decodedToken.role !== "admin") return res.status(401).json({ message: "User not authorised as admin" })
        req.user = decodedToken



        next()




    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid token" });

    }
}



// for host
const authHost = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) return res.status(401).json({ message: "User not authorised" });

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decodedToken) return res.status(401).json({ message: "Invalid token" });


        if (decodedToken.role !== "host") return res.status(401).json({ message: "User not authorised as host" })
        req.user = decodedToken

        
        

        next()




    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid token" });

    }
}
module.exports = { authUser, authAdmin, authHost }