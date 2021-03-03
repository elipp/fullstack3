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

function addPerson(newperson) {
	const person = new Person(newperson)
		person.save().then(response => {
		console.log(`added person ${person.name} with number ${person.number} to phonebook`)
	}).catch(e=>{console.log(e)})
}

function deletePerson(id) {

}

function modifyPerson(id) {

}

app.get('/', (req, res) => {
	  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req,res) => {
	res.send(`<div><p>Phonebook has info for ${persons.length} people</p><p>${new Date(Date.now()).toLocaleString()}</p></div>`)
})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(p => {
	  res.json(p)
	})
})

app.get('/api/persons/:id', (req, resp) => {
	const id = Number(req.params.id)
	Person.find({id: id}).then(p => {
		if (p) {
			resp.json(p[0])
		}
		else {
			resp.status(404).end()
		}
	})

})

function randint(max) {
	return Math.floor(Math.random() * Math.floor(max))
}

app.post('/api/persons', (req,resp) => {

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
		newperson.id = randint(2**16)
		persons = persons.concat(newperson)
		console.log(`trying to add new person with name ${newperson.name}, id: ${newperson.id}`)

		addPerson(newperson)
		resp.json(newperson)

	}
})

app.delete('/api/persons/:id', (request, response) => {
	  const id = Number(request.params.id)
	  Person.findByIdAndDelete(request.params.id).then(result => {
		  persons = persons.filter(p => p.id !== id)
		  response.status(204).end()
	  }).catch(e => console.log(e))
})

app.put('/api/notes/:id', (req, resp, next) => {
	
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	  console.log(`Server running on port ${PORT}`)
})
