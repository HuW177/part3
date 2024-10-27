import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001/api/persons')
      .then(response => {
        setData(response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }, [])

  return (
    <div>
        <h1>Phonebook</h1>
        <ul>
            {data.map(person => ( 
                <p key={person.id}>{person.name} {person.number}</p>
            ))}
        </ul>
    </div>
  )
}

export default App

