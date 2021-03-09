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

	if (!req.body.name || !req.body.number) {
		return resp.status(400).json({error:'missing name or number field!'})
	}

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
			person.save()
			.then( p => {
			console.log(`added person ${p.name} with number ${p.number} to phonebook`)
			persons = persons.concat(newperson)
			resp.json(p)
		}).catch(error => next(error))
	}
})

app.delete('/api/persons/:id', (req, resp, next) => {
	  Person.findByIdAndDelete(req.params.id).then(todelete => {
		  persons = persons.filter(p => p.id !== todelete.id)
		  resp.status(204).end()
	  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, resp, next) => {
	Person.findByIdAndUpdate(req.params.id, req.body).then(toupdate => {
		console.log(`updated person ${toupdate.name}'s number!`)
		resp.json(req.body)
	}).catch(error=>next(error))
})

const errorHandler = (error, req, resp, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return resp.status(400).send({ error: 'malformatted id' })
	}
	else if (error.name == 'ValidationError') {
		return resp.status(400).json({error: error.message})
	}

	next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	  console.log(`Server running on port ${PORT}`)
})
