const mongoose = require('mongoose')

if (process.argv.length<3) {
	  console.log('give password as argument')
	  process.exit(1)
}

const password = process.argv[2]

const url =`mongodb+srv://mongouser:${password}@cluster0.prh5k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
	  name: String,
	  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
	Person.find({}).then(result => {
		result.forEach(p => { console.log(p) })
		mongoose.connection.close()
	})
}

else if (process.argv.length > 4) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4]
	})
	person.save().then(response => {
		  console.log(`added person ${person.name} with number ${person.number} to phonebook`)
		  mongoose.connection.close()
	})
}
