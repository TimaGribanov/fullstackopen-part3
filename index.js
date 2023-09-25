const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', function getBody(req) {
    return `{ "name": "${req.body.name}", "number": "${req.body.number}"}`
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

let persons = [
    { 
        "id": 0,
        "name": "Arto Hellas", 
        "number": "040-123456",
        "visible": true
      },
      { 
        "id": 1,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "visible": true
      },
      { 
        "id": 2,
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "visible": true
      },
      { 
        "id": 3,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "visible": true
      }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person)
        res.json(person)
    else
        res.status(404).end()
})

app.get('/info', (req, res) => {
    const number = persons.length
    const date = new Date(Date.now())
    res.send(`<p>The phonebook has info for ${number} people</p><p>${date}</p>`)
})

app.post('/api/persons', (req, res) => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0

    if (!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.find(p => p.name ===req.body.name) !== undefined)
        return res.status(400).json({
            error: 'name must be unique'
        })

    const id = Math.floor(Math.random() * (999 - maxId) + 999)

    const person = {
        id: id,
        name: req.body.name,
        number: req.body.number,
        visible: true
    }

    persons.push(person)
    res.json(person)
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