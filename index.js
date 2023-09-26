require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./modules/person')
const app = express()

morgan.token('body', function getBody(req) {
    return `{ "name": "${req.body.name}", "number": "${req.body.number}"}`
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

// let persons = [
//     { 
//         "id": 0,
//         "name": "Arto Hellas", 
//         "number": "040-123456",
//         "visible": true
//       },
//       { 
//         "id": 1,
//         "name": "Ada Lovelace", 
//         "number": "39-44-5323523",
//         "visible": true
//       },
//       { 
//         "id": 2,
//         "name": "Dan Abramov", 
//         "number": "12-43-234345",
//         "visible": true
//       },
//       { 
//         "id": 3,
//         "name": "Mary Poppendieck", 
//         "number": "39-23-6423122",
//         "visible": true
//       }
// ]

app.get('/', (req, res) => {
    res.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findById(id)
        .then(people => res.json(people))
        .catch(error => res.status(404).end())
})

app.get('/info', (req, res) => {
    const date = new Date(Date.now())
    Person.count({})
        .then(number =>
            res.send(`<p>The phonebook has info for ${number} people</p><p>${date}</p>`))    
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.number === undefined)
        return res.status(400).json({ error: 'name or number missing' })

    // if (person.find(p => p.name ===req.body.name) !== undefined)
    //     return res.status(400).json({ error: 'name must be unique' })

    const person = new Person({
        name: body.name,
        number: body.number,
        visible: body.visible || true
    })

    person.save().then(savedPerson => res.json(savedPerson))
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        persons.pop(id)
        res.json('Deleted')
    } else
        res.status(404).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})