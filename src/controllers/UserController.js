const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const User = require('../models/User')
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json')

const bcryptjs = require('bcryptjs')

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    })
}

module.exports = {

    async store(req, res) {

        const { name, email, password, address } = req.body

        const user = await User.create({ name, email, password, address })

        return res.json({ user, token: generateToken({ id: user._id }), })

    },

    async update(req, res) {

        const { name, email, address, password, userPcs2, passwordPcs2 } = req.body

        if (password) {
            await bcryptjs.hash(password, 10)
                .then(async (result) => {
                    await User.updateOne({ email }, {
                        password: result
                    })
                })
                .catch((error) => { console.error(error) })
        }

        if (name && email && address) {
            await User.updateOne({ email }, {
                name, email, address, user_pcs2: userPcs2, password_pcs2: passwordPcs2
            })   
        }

        await User.findOne({ email })
            .then((response) => { return res.status(200).json(response) })
    },

    async updateImg(req, res) {
        const { filename } = req.file
        const { email, image } = req.headers    
    
        await User.updateOne({ email }, { thumbnail: filename })
          .then(() => {
              if (image && image !== 'default.png') {
                promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'uploads', image))
              } 
            })
          .catch(error => { console.error(error)} )        
        
        const userUpdate = await User.findOne({ email })

        return res.status(200).json(userUpdate)
        
    },

    async deleteImg(req, res) {
        const { email, image } = req.headers
    
        await User.updateOne({ email }, { thumbnail: 'default.png' })
          .then(() => {
              if (image) {
                promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'uploads', image))
              } 
            })
          .catch(error => { console.error(error)} )        
        
        const userUpdate = await User.findOne({ email })

        return res.status(200).json(userUpdate)
        
    },

    async authenticate(req, res) {

        const { email, password } = req.headers

        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(400).send({ error: 'Usuário não existe' })
        }

        if (!await bcryptjs.compare(password, user.password)) {
            return res.status(400).send({ error: 'Senha inválida' })
        }
        user.password = undefined
        return res.json({ user, token: generateToken({ id: user._id }), })

    },

    async userById(req, res) {

        const { userId } = req.params;

        const user = await User.findOne({ _id: userId })

        return res.json({ user });

    }

};