const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

let persons = []

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

app.use(cors())

app.use(express.static('build'))


app.get('/', (req, res) => {
	  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req,res) => {
	res.send(`<div><p>Phonebook has info for ${persons.length} people</p><p>${new Date(Date.now()).toLocaleString()}</p></div>`)
})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(p => {
	  persons = p
	  res.json(p)
	})
})

app.get('/api/persons/:id', (req, resp, next) => {
	Person.findById(req.params.id).then(p => {
		if (p) {
			console.log(p)
			resp.json(p)
		}
		else {
			resp.status(404).end()
		}
	}).catch(error => next(error))

})

function randint(max) {
	return Math.floor(Math.random() * Math.floor(max))
}

app.post('/api/persons', (req,resp,next) => {

//	if (!req.body.content) {
//		return resp.status(400).json({error:'content missing'})
//	}

	const newperson = req.body

	if (!newperson) {
		return resp.status(404).end()
	}
	else {
		if (!newperson.name || !newperson.number) {
			return resp.status(400).json({error: 'name or number missing'})
		}
		if (persons.find(n => {return n.name == newperson.name })) {
			return resp.status(400).json({error: 'name already in phonebook'})
		}

		console.log(`trying to add new person with name ${newperson.name} and number ${newperson.number}`)

		const person = new Person(newperson)
			person.save().then(resp => {
			console.log(`added person ${person.name} with number ${person.number} to phonebook`)
			persons = persons.concat(newperson)
		}).catch(error => next(error))

		resp.json(newperson)

	}
})

app.delete('/api/persons/:id', (req, resp, next) => {
	  Person.findByIdAndDelete(req.params.id).then(todelete => {
		  persons = persons.filter(p => p.id !== todelete.id)
		  resp.status(204).end()
	  }).catch(error => next(error))
})

app.put('/api/notes/:id', (req, resp, next) => {
	Person.findById(req.params.id).then(toupdate => {
		//toupdate.number = req.para
		console.log(toupdate)
	}).catch(error=>next(error))
})

const errorHandler = (error, req, resp, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return resp.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	  console.log(`Server running on port ${PORT}`)
})
