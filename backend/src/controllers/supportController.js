const SupportTicket = require('../models/SupportTicket');

// @desc    Get all tickets
// @route   GET /api/support/tickets
exports.getTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update ticket status
// @route   PUT /api/support/tickets/:id
exports.updateTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(ticket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
