const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({

  content: {
    type: String,
    minLength: 3,
    required: true
  },

  number: {
    type: String,
    required: true
  }

})


const Person = mongoose.model('Person', personSchema)

const name = process.argv[2]
const number = process.argv[3]

if (number && name) {
  const person = new Person ({ number, name })

  person.save()
    .then(result => {
      console.log('name number saved!')
      mongoose.connection.close()
    })
    .catch(error => {
      console.error('Failed:', error.message)
      mongoose.connection.close()
    })


} else if (!name && !number) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.number} ${person.name}`)
    })
    mongoose.connection.close()
  })
    .catch(error => {
      console.error('Failed:', error.message)
      mongoose.connection.close()
    })
} else {
  console.log('Provide both a name and number')
  mongoose.connection.close()
}

module.exports = Person