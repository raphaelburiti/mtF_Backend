const { Schema, model } = require('mongoose')

const bcryptjs = require('bcryptjs')

const UserSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    address: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: false,
        default: null
    },
    user_pcs2: {
        type: String,
        required: false,
        default: null
    },
    password_pcs2: {
        type: String,
        required: false,
        default: null
    },

}, {
    timestamps: true,
});

UserSchema.pre('save', async function (next) {
    const hash = await bcryptjs.hash(this.password, 10)
    this.password = hash

    next();
})

module.exports = model('User', UserSchema);