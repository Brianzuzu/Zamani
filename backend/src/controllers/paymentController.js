const Transaction = require('../models/Transaction');
const Project = require('../models/Project');
const SavingGoal = require('../models/SavingGoal');
const axios = require('axios');

// @desc    Initialize a payment with Flutterwave
// @route   POST /api/payments/initialize
exports.initializePayment = async (req, res) => {
    try {
        const { amount, currency, email, name, phone, type, referenceId, method } = req.body;

        // Validation
        if (!amount || !email || !type || !referenceId) {
            return res.status(400).json({ message: 'Missing required payment details' });
        }

        const tx_ref = `ZAM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Create a pending transaction in our DB
        const transaction = await Transaction.create({
            user: req.user.id,
            amount,
            currency: currency || 'KES',
            type, // 'Investment' or 'Deposit'
            method: method || 'Card',
            status: 'Pending',
            reference: tx_ref,
            description: `Payment for ${type === 'Investment' ? 'Project' : 'Saving Goal'} ${referenceId}`,
            metadata: {
                referenceId,
                email,
                name
            }
        });

        // Flutterwave configuration (placeholder for user credentials)
        const flwConfig = {
            headers: {
                Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
            }
        };

        const flwData = {
            tx_ref,
            amount,
            currency: currency || 'KES',
            redirect_url: process.env.FLW_REDIRECT_URL || 'http://localhost:3000/payment-status',
            customer: {
                email,
                name,
                phonenumber: phone
            },
            customizations: {
                title: 'Zamani Investments',
                description: `Funding for ${type}`,
                logo: 'https://zamani.io/logo.png' // Add your logo
            },
            meta: {
                transactionId: transaction._id.toString(),
                type,
                referenceId
            }
        };

        // Call Flutterwave Standard API
        const response = await axios.post('https://api.flutterwave.com/v3/payments', flwData, flwConfig);

        if (response.data.status === 'success') {
            res.json({
                status: 'success',
                link: response.data.data.link,
                transactionId: transaction._id,
                reference: tx_ref
            });
        } else {
            throw new Error('Flutterwave initialization failed');
        }

    } catch (err) {
        console.error('Payment Init Error:', err.response?.data || err.message);
        res.status(500).json({ message: err.message });
    }
};

// @desc    Flutterwave Webhook to handle payment updates
// @route   POST /api/payments/webhook
// @desc    Verify payment status
// @route   GET /api/payments/verify/:reference
exports.verifyPayment = async (req, res) => {
    try {
        const { reference } = req.params;
        const transaction = await Transaction.findOne({ reference });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // If still pending, we could optionally call FLW's verify endpoint here
        // to check in real-time if the webhook hasn't arrived yet.
        if (transaction.status === 'Pending') {
            const flwConfig = {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
                }
            };
            
            try {
                // Verify with Flutterwave directly
                const response = await axios.get(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${reference}`, flwConfig);
                
                if (response.data.status === 'success' && response.data.data.status === 'successful') {
                    // Update locally if FLW says it's successful but webhook was slow
                    transaction.status = 'Completed';
                    await transaction.save();

                    // Update Project or Saving Goal balances (same logic as webhook)
                    const { type, referenceId } = transaction.metadata;
                    if (type === 'Investment') {
                        await Project.findByIdAndUpdate(referenceId, {
                            $inc: { currentAmount: transaction.amount }
                        });
                    } else if (type === 'Deposit') {
                        await SavingGoal.findByIdAndUpdate(referenceId, {
                            $inc: { currentAmount: transaction.amount }
                        });
                    }
                }
            } catch (flwErr) {
                console.log('FLW Verification polling failed (expected if not paid yet)', flwErr.message);
            }
        }

        res.json({
            status: transaction.status,
            amount: transaction.amount,
            currency: transaction.currency
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.handleWebhook = async (req, res) => {
    try {
        // Verify FLW Signature (User should set FLW_WEBHOOK_SECRET)
        const secret = process.env.FLW_WEBHOOK_SECRET;
        const signature = req.headers['verif-hash'];

        if (secret && signature !== secret) {
            return res.status(401).json({ message: 'Invalid signature' });
        }

        const payload = req.body;
        
        if (payload.status === 'successful' || payload.status === 'completed') {
            const tx_ref = payload.tx_ref;
            const transactionId = payload.meta?.transactionId;

            // Find and update the transaction
            const transaction = await Transaction.findOne({ reference: tx_ref });
            
            if (transaction && transaction.status === 'Pending') {
                transaction.status = 'Completed';
                await transaction.save();

                // Update Project or Saving Goal balances
                const { type, referenceId } = transaction.metadata;

                if (type === 'Investment') {
                    await Project.findByIdAndUpdate(referenceId, {
                        $inc: { currentAmount: transaction.amount }
                    });
                } else if (type === 'Deposit') {
                    await SavingGoal.findByIdAndUpdate(referenceId, {
                        $inc: { currentAmount: transaction.amount }
                    });
                }
            }
        }

        res.status(200).send('Webhook Received');
    } catch (err) {
        console.error('Webhook Error:', err);
        res.status(500).json({ message: err.message });
    }
};

// @desc    Initiate a payout (transfer) via Flutterwave
// @param   details { amount, currency, account_bank, account_number, narration, reference }
exports.initiatePayout = async (details) => {
    try {
        const flwConfig = {
            headers: {
                Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
            }
        };

        const flwData = {
            account_bank: details.account_bank || 'MPS', // Default to M-Pesa if not specified
            account_number: details.account_number,
            amount: details.amount,
            currency: details.currency || 'KES',
            narration: details.narration || 'Zamani Payout',
            reference: details.reference,
            callback_url: process.env.FLW_PAYOUT_WEBHOOK_URL || ''
        };

        console.log('Initiating Flutterwave Transfer:', flwData.reference);
        const response = await axios.post('https://api.flutterwave.com/v3/transfers', flwData, flwConfig);

        return response.data;
    } catch (err) {
        console.error('Flutterwave Transfer Error:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Flutterwave transfer failed');
    }
};
