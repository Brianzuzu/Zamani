const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Managed Lands', 'Build or Buy a House', 'Vehicle Sourcing', 'Utilities and Products', 'Business Opps', 'Kenyan Markets']
    },
    subCategory: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    region: {
        type: String,
        trim: true
    },
    area: {
        type: String,
        trim: true
    },
    price: {
        type: String,
        required: true
    },
    targetAmount: {
        type: Number
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    roi: {
        type: String,
        trim: true
    },
    images: [{
        type: String // Cloudinary URLs
    }],
    tags: [{
        label: String,
        color: String
    }],
    partner: {
        name: String,
        logo: String
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Draft', 'Closed'],
        default: 'Active'
    },
    isHotDeal: {
        type: Boolean,
        default: false
    },
    // Sector specific metadata
    metadata: {
        // Land
        plotSize: String,
        titleType: String,
        isServiced: Boolean,
        isNearTarmac: Boolean,
        hasUtilities: Boolean,
        county: String,
        income: String,
        // House
        bedrooms: Number,
        bathrooms: Number,
        propertyType: String,
        rentalYield: String,
        units: Number,
        completionDate: String,
        verified: Boolean,
        offPlan: Boolean,
        hotel: Boolean,
        office: Boolean,
        retail: Boolean,
        // Vehicle
        type: { type: String },
        make: String,
        model: String,
        year: Number,
        transmission: String,
        mileage: String,
        condition: String,
        source: String,
        engine: String,
        fuel: String,
        fob: String,
        ship: String,
        duty: String,
        clear: String,
        // Business
        capitalRequired: String,
        breakEven: String,
        revenueProjection: String,
        riskLevel: String,
        marketDemand: String,
        // Common / Contact
        partner: String,
        phone: String,
        email: String,
        tag: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
