const { Schema, model } = require('mongoose')

const ServiceSchema = new Schema({

    id_customer: {
        type: String,
        required: true,
        ref: 'Customer'
        // deve ser unique
    },
    id_user: {
        type: String,
        required: true,
    },
    id_service: {
        type: String,
        required: true,
    },
    date_service: {
        type: Date,
        required: true,
    },
    qtd_service: {
        type: Number,
        required: true,
        default: 1,
    },
    distance_service: {
        type: Number,
    },
    parking_service: {
        type: Number,
        default: 0,
    },
    toll_service: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = model('Service', ServiceSchema);