const stripe = require('../config/stripe')

const createCheckoutSession = async (req, res) => {
    try {
        const { vehicleId, pickupLocation, pickupDateTime, dropoffDateTime, address, driverRequired, totalBill } = req.body;
        const userId = req.user.id;

        

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: `Booking for Vehicle ID ${vehicleId}`,
                        description: `From ${pickupDateTime} to ${dropoffDateTime}`,
                    },
                    unit_amount: Math.round(totalBill * 100), 
                },
                quantity: 1,
            }],
            metadata: {
                vehicleId,
                userId,
                pickupLocation,
                pickupDateTime,
                dropoffDateTime,
                address,
                driverRequired,
            },
            success_url: `${process.env.CLIENT_URL}/user/vehicleBooking/${vehicleId}?success=true`,
            cancel_url: `${process.env.CLIENT_URL}/user/vehicleBooking/${vehicleId}?success=false`,
        });

        res.status(200).json({ id: session.id, url: session.url });

    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Failed to create Stripe session' });
    }
};
module.exports={createCheckoutSession}