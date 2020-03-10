const Service = require('../models/Service')

module.exports = {

    async store(req, res) {

        const { id_customer, id_user, id_service, qtd_service, date_service, 
            distance_service, parking_service, toll_service } = req.body

        const service = await Service.create({ id_customer, id_user, id_service,
            qtd_service, date_service, distance_service, parking_service, toll_service })

        return res.json(service);
    },

    async indexByDate(req, res) {

        const { date_service } = req.headers
        const { userId } = req.params

        const orderServices = await Service.find({
            $and: [
                { id_user: { $eq: userId } },
                { date_service: { $eq: date_service} },
            ],
        }).sort({ createdAt: 1 })

        if (!orderServices) {
            return res.status(400).send({ error: 'called not found' })
        }

        return res.json({ orderServices });
    },

    async updateById(req, res) {

        const { id_selectedService, id_customer, id_service, qtd_service, 
            distance_service, parking_service, toll_service } = req.body

            await Service.updateOne({ _id : id_selectedService }, {
                id_customer, id_service, qtd_service, distance_service,
                parking_service, toll_service 
            })
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                return res.status(400).json(error)
            })
    },

    async deleteById(req, res) {
        const { _id } = req.headers

        await Service.deleteOne({ _id })
        .then(response => {
            return res.status(200).json(response)
        })
        .catch(error => {
            return res.status(400).json(error)
        })
    }

}