const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('dist'));

let persons = [
    { "id": "1", "name": "Arto Hellas", "number": "040-123456" },
    { "id": "2", "name": "Ada Lovelace", "number": "39-44-5323523" },
    { "id": "3", "name": "Dan Abramov", "number": "12-43-234345" },
    { "id": "4", "name": "Mary Poppendieck", "number": "39-23-6423122" }
];

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    const count = persons.length;
    const time = new Date();
    response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${time}</p>
    `);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body;
    if (!name || !number) {
        return response.status(400).json({ error: 'name or number is missing' });
    }

    const nameUnique = persons.some(person => person.name === name);
    if (nameUnique) {
        return response.status(400).json({ error: 'name must be unique' });
    }

    const newPerson = { id: Math.floor(Math.random() * 999999).toString(), name, number };
    persons.push(newPerson);
    response.status(201).json(newPerson);
});

app.get('*', (request, response) => {
    response.sendFile(__dirname + '/dist/index.html');
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
