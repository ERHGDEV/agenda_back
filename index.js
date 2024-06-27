const express = require( 'express' )
const app = express()
const PORT = process.env.PORT || 3001
const morgan = require( 'morgan' )
const cors = require( 'cors' )

app.use( express.json() )
app.use( morgan( ':method :url :status :res[content-length] - :response-time ms' ) )
app.use( express.static( 'dist' ) )
app.use( cors() )

const date = new Date();

const requestLogger = ( request, response, next ) => {
    console.log( 'Methot: ', request.method )
    console.log( 'Path: ', request.path )
    console.log( 'Body: ', request.body )
    console.log( '---' )
    next()
}

app.use( requestLogger )

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get( '/api/persons', ( request, response ) => {
    response.json( persons )
})

app.get( '/api/persons/:id', ( request, response ) => {
    const id = Number( request.params.id )
    const person = persons.find( person => person.id === id )
    if ( person ) {
        response.json( person )
    } else {
        response.status( 404 ).end()
    }
})

app.post( '/api/persons', ( request, response ) => {
    const body = request.body
    const nameExist = persons.find( person => person.name.toLocaleLowerCase() === body.name.toLocaleLowerCase() )

    if ( !body.name || !body.number ) {
        return response.status( 400 ).json({
            error: 'content missing'
        })
    } else if ( nameExist ) {
        return response.status( 400 ).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: Math.floor( Math.random()*1000000 ),
        name: body.name,
        number: body.number
    }

    persons = persons.concat( person )

    response.json( person )
})

app.delete( '/api/persons/:id', ( request, response ) => {
    const id = Number( request.params.id )
    persons = persons.filter( person => person.id !== id )
    response.status( 204 ).end()
})

app.get( '/info', ( request, response ) => {
    response.send(`<p>
        Phonebook has info for ${ persons.length } people <br>
        ${ date }
    </p>`)
})

const unknownEndpoint = ( request, response ) => {
    response.status( 404 ).send({ error: 'unknown endpoint' })
}

app.use( unknownEndpoint )

app.listen( PORT, () => {
    console.log( `Server running on port ${ PORT }` )
})
