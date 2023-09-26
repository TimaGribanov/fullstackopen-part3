require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./modules/person')
const app = express()

morgan.token('body', function getBody(req) {
  return `{ "name": "${req.body.name}", "number": "${req.body.number}"}`
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if (person)
        res.json(person)
      else
        next()
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  const date = new Date(Date.now())
  Person.count({})
    .then(number =>
      res.send(`<p>The phonebook has info for ${number} people</p><p>${date}</p>`))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
    visible: body.visible || true
  })

  person
    .save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { name, number, visible } = req.body


  Person.findByIdAndUpdate(
    id,
    { name, number, visible },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(result => res.json(result))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then(result => res.status(204).end())
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})