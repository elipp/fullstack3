const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const password = process.env.MONGODB_PASS//process.argv[process.argv.length-1] || "NOPASSWORD"
if (!password) {
	console.log("No MONGODB_PASS envvar set! Errors inbound.")
}

const url = `mongodb+srv://mongouser:${password}@cluster0.qhywi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
console.log(`connecting to ${url}`)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true
	},
	number: {
		type: String,
		minlength: 8,
		required: true
	}
})

personSchema.plugin(uniqueValidator)

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model("Person", personSchema)
