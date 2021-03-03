const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let notes = [
	{ 
		id: 0,
		name: "Arto Hellas",
		number: "040 204021"
	},
	{ 
		id: 1,
		name: "Arto Jaahas",
		number: "040 30153531"
	},
	{ 
		id: 2,
		name: "Esko Juupas",
		number: "040 3311133"
	},
	{
		id: 3,
		name: "Rauni Kaspia",
		number: "050 3213131"
	}

]

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

app.use(cors())

app.get('/', (req, res) => {
	  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req,res) => {
	res.send(`<div><p>Phonebook has info for ${notes.length} people</p><p>${new Date(Date.now()).toLocaleString()}</p></div>`)
})

app.get('/api/persons', (req, res) => {
	  res.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const note = notes.find(note => { 
		return note.id === id 
	})
	if (note) {
		response.json(note)
	}
	else {
		response.status(404).end()
	}

})

function randint(max) {
	return Math.floor(Math.random() * Math.floor(max))
}

app.post('/api/persons', (req,resp) => {

//	if (!req.body.content) {
//		return resp.status(400).json({error:'content missing'})
//	}

	const newnote = req.body
	console.log(newnote)

	if (!newnote) {
		return resp.status(404).end()
	}
	else {
		if (!newnote.name || !newnote.number) {
			return resp.status(400).json({error: 'name or number missing'})
		}
		if (notes.find(n => {return n.name == newnote.name })) {
			return resp.status(400).json({error: 'name already in phonebook'})
		}
		newnote.id = randint(2**16)
		notes = notes.concat(newnote)
		resp.json(newnote)
		console.log(`added new note with name ${newnote.name}, id: ${newnote.id}`)
	}
})

app.delete('/api/persons/:id', (request, response) => {
	  const id = Number(request.params.id)
	  notes = notes.filter(note => note.id !== id)

	  response.status(204).end()
})


app.listen(process.env.PORT || 3001, () => {
	  console.log(`Server running on port ${PORT}`)
})
