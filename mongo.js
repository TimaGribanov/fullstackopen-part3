const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.m0cpqbn.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Phonenumber = mongoose.model('Phonenumber', numberSchema)

if (process.argv.length < 4) {
    Phonenumber.find({}).then(res => {
        console.log('phonebook:')
        res.forEach(number => {
            console.log(number.name, number.number)
        })
        mongoose.connection.close()
    })
} else {
    const number = new Phonenumber({
        name: process.argv[3],
        number: process.argv[4]
    })

    number.save().then(res => {
        console.log('number saved!')
        mongoose.connection.close()
    })
}