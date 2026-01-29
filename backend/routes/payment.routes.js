const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * This route is designed for MTN MoMo and Airtel Money (Rwanda),
 * using a mobile-money style flow:
 *  - User enters phone + chooses network (MTN or Airtel)
 *  - We call a mobile money gateway (e.g. Flutterwave) to initiate the charge
 *  - The user confirms on their phone (USSD / app prompt)
 *
 * NOTE: You must configure real gateway credentials in your .env file
 * and adapt the request body to match the provider you choose.
 */

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY; // example for Flutterwave
const FLW_BASE_URL = process.env.FLW_BASE_URL || 'https://api.flutterwave.com/v3';

router.post('/mobile-money', async (req, res) => {
    try {
        if (!FLW_SECRET_KEY) {
            return res.status(500).json({
                error: 'Mobile money payment is not configured. Please set FLW_SECRET_KEY in backend .env'
            });
        }

        const { amount, phoneNumber, network, customerName, customerEmail } = req.body;

        if (!amount || !phoneNumber || !network) {
            return res.status(400).json({
                error: 'amount, phoneNumber and network are required'
            });
        }

        if (!['MTN', 'AIRTEL'].includes(network)) {
            return res.status(400).json({ error: 'network must be MTN or AIRTEL' });
        }

        const txRef = `SC-${Date.now()}`;

        // Example payload for Flutterwave "mobile_money_rwanda" charge.
        // Please confirm the latest fields in their documentation.
        const payload = {
            tx_ref: txRef,
            amount: String(amount),
            currency: 'RWF',
            email: customerEmail || 'customer@example.com',
            fullname: customerName || 'Customer',
            phone_number: phoneNumber,
            network: network.toLowerCase(), // 'mtn' or 'airtel'
            redirect_url: process.env.CLIENT_URL || 'http://localhost:5173/order-success'
        };

        const flwResponse = await axios.post(
            `${FLW_BASE_URL}/charges?type=mobile_money_rwanda`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${FLW_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // The gateway usually returns a status like "success" and tells the user
        // to complete payment on their phone.
        const data = flwResponse.data;

        return res.json({
            status: data.status,
            message: data.message,
            txRef,
            providerData: data.data || null
        });
    } catch (err) {
        console.error('Mobile money initiation failed:', err.response?.data || err.message);
        return res.status(500).json({ error: 'Failed to start mobile money payment' });
    }
});

module.exports = router;


