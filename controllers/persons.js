const personsRouter = require( 'express' ).Router()
const Person = require( '../models/person' )

personsRouter.get( '/', ( request, response ) => {
    Person.find({}).then( persons => {
        response.json( persons )
    })
})

personsRouter.get( '/:id', ( request, response, next ) => {
    Person.findById( request.params.id )
        .then( person => {
            if ( person ) {
                response.json( person )
            } else {
                response.status( 404 ).end()
            }
        })
        .catch( error => next( error ))
})

personsRouter.post( '/', ( request, response, next ) => {
    const body = request.body
    
    if ( body.name === undefined || body.number === undefined ) {
        return response.status( 400 ).json({
            error: 'content missing'
        })
    } 

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then( savedPerson => {
            response.json( savedPerson )
        })
        .catch( error => next( error ) )
})

personsRouter.put( '/:id', ( request, response, next ) => {
    const { name, number, important } = request.body

    Person.findByIdAndUpdate(
        request.params.id, 
        { name, number, important },
        { new: true, runValidators: true, context: 'query' }
    )
        .then( updatedPerson =>{
            response.json( updatedPerson )
        })
        .catch( error => next( error ) )
})

personsRouter.delete( '/:id', ( request, response ) => {
    Person.findByIdAndDelete( request.params.id )
        .then( result => {
            response.status( 204 ).end()
        })
        .catch( error => next( error ) )
})

module.exports = personsRouter