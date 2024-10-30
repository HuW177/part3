const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))





app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})


app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const time = new Date()
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${time}</p>
      `)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response,next) => {
  const { name, number } = request.body

  if (!number){
    return response.status(400).json({ error: 'number is missing' })
  }

  if (!name){
    return response.status(400).json({ error: 'name is missing' })
  }


  Person.findOne({ name: name })
    .then(exists => {
      if (exists) {
        return response.status(400).json({ error: 'name must be unique' })
      }

      const person = new Person({ name, number })
      return person.save()
    })
    .then(saved => {
      if (saved) response.status(201).json(saved)
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


app.use(errorHandler)

app.get('*', (request, response) => {
  response.sendFile(__dirname + '/dist/index.html')
})


const PORT =  process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})