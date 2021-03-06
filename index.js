require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Persons = require('./models/persons');

app.use(express.json());
app.use(express.static('build'));
app.use(cors());

app.get('/api/persons', (req, res) => {
  Persons.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/api/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${Persons.length} people</p>
    <p>${new Date()}</p>
    `);
});

app.get('/api/persons/:id', (req, res, next) => {
  Persons.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Persons.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: 'name missing' });
  }

  if (body.number === undefined) {
    return res.status(400).json({ error: 'number missing' });
  }

  const person = new Persons({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
