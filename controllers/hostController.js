const Vehicle = require('../models/Vehicle')
const Booking = require('../models/Booking')

const getHostVehicle = async (req, res, next) => {
    try {
       const userId = req.user.id
        console.log("userId", userId);
        
        if (!userId) return res.status(401).json({ message: "User not authorised" })
        const vehicle = await Vehicle.find({ ownerId: userId })
        if (!vehicle) return res.status(404).json({ message: "Vehicle Not Found" })
        res.status(200).json({ message: 'Vehicle Found', vehicle })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}


const getHostStats = async (req, res) => {
  try {
    const hostId = req.user.id;

    const totalVehicles = await Vehicle.countDocuments({ hostId });

    const hostVehicles = await Vehicle.find({ hostId }, '_id');
    const vehicleIds = hostVehicles.map(v => v._id);

    const totalBookings = await Booking.countDocuments({ vehicleId: { $in: vehicleIds } });

  
    const earningsResult = await Booking.aggregate([
      { $match: { vehicleId: { $in: vehicleIds } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalEarnings = earningsResult[0]?.total || 0;

  
    const monthlyData = await Booking.aggregate([
      {
        $match: {
          vehicleId: { $in: vehicleIds },
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) } // from Jan 1st
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          earnings: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const monthlyFormatted = months.map((month, index) => {
      const match = monthlyData.find(m => m._id === index + 1);
      return {
        month,
        earnings: match ? match.earnings : 0
      };
    });

    res.status(200).json({
      totalVehicles,
      totalBookings,
      totalEarnings,
      monthlyData: monthlyFormatted
    });

  } catch (error) {
    console.error('Host Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch host statistics' });
  }
};
module.exports = {
    getHostVehicle,getHostStats
}