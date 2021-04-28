const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mohamednasr86:${password}@cluster0.cfnr6.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const phonebookSchema = new mongoose.Schema({
  person: String,
  number: String,
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

const personOne = new Phonebook({
  person: 'Ryan',
  number: '040-34564747',
});

personOne.save().then((result) => {
  console.log(
    `added ${personOne.person} number ${personOne.number} to phonebook`
  );
  mongoose.connection.close();
});

// Phonebook.find({}).then((result) => {
//   result.forEach((p) => {
//     console.log(p.person, p.number);
//   });
//   mongoose.connection.close();
// });
