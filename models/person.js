const mongoose = require('mongoose')

const password = process.env.MONGODB_PASS//process.argv[process.argv.length-1] || "NOPASSWORD"
if (!password) {
	console.log("No MONGODB_PASS envvar set! Errors inbound.")
}

const url =`mongodb+srv://mongouser:${password}@cluster0.prh5k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

console.log(`connecting to ${url}`)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
	id: Number,
	name: String,
	number: String
})

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
	  transform: (document, returnedObject) => {
		      returnedObject.id = returnedObject._id.toString()
		      delete returnedObject._id
		      delete returnedObject.__v
		    }
})

module.exports = mongoose.model('Person', personSchema)
