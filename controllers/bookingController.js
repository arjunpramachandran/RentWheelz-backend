const Booking = requier('../models/Booking')

const newBooking = async (req, res) => {
    try {
        const { vehicleId,pickupLocation,dropoffLocation, startDate, endDate ,totalAmount } = req.body || {}
        if (!vehicleId || !userId || !startDate || !endDate) {
            return res.status(400).json({ error: "All Fields are Required" })
        }
        const bookingExists = await Booking.findOne({ vehicleId, userId, startDate, endDate })
        if (bookingExists) return res.status(400).json({ error: 'Booking Already Exists' })

        const newBooking = new Booking({ userId,vehicleId,pickupLocation,dropoffLocation, startDate, endDate ,totalAmount })
        const savedBooking = await newBooking.save()

        res.status(201).json({ message: 'Booking Created', savedBooking })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}

const getBooking = async (req, res) => {
    try {
        const booking = await Booking.find({ userId: req.user._id }).populate('vehicleId')
        if (!booking) return res.status(404).json({ message: "No bookings found" })
        res.status(200).json({ message: "Bookings retrieved successfully", booking })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })

    }
}