const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-94847',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-475658',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '043-123756',
  },
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const generateId = (max, persons) => {
    const id = Math.floor(Math.random() * max);
    const found = persons.find((person) => person.id === id);
    if (!found) {
      return id;
    } else {
      return generateId(max, persons);
    }
  };

  const person = req.body;

  if (!person.name) {
    return res.status(400).json({
      error: 'name missing',
    });
  }

  if (!person.number) {
    return res.status(400).json({
      error: 'number missing',
    });
  }

  if (persons.find((p) => p.name === person.name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  person.id = generateId(1000, persons);

  persons = persons.concat(person);
  console.log(persons);

  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
