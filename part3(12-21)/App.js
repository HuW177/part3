import React, { useEffect, useState } from 'react'
import personService from './services/personService'
import Notification from './Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => showMessage('Unable to retrieve contacts', 'error'))
  }, [])

  const showMessage = (message, type = 'success') => {
    setMessage(message)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)

  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }



    const existsPerson = persons.find(person => person.name === newName)

    if (existsPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(existsPerson.id, personObject)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== existsPerson.id ? person : updatedPerson))
            showMessage(`Updated ${newName}'s number`, 'success')
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              showMessage(`Information of ${newName} has already been removed from server`, 'error')
            } else {
              showMessage(`Failed to update ${newName}'s number`, 'error')
            }
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          showMessage(`Added ${newName}`, 'success')
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          showMessage(`Failed to add ${newName}`, 'error')
        })
    }
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }

    
  }



  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <div>
        filter shown with: <input value={filter} onChange={handleFilterChange} />
      </div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsShow.map(person => (
          <p key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id, person.name)}>Delete</button>
          </p>
        ))}
      </ul>
    </div>
  );
};

export default App
