const mongoose = require( 'mongoose' )
require('dotenv').config()

mongoose.set( 'strictQuery', false )

const url = process.env.MONGODBURL

mongoose.connect( url )
    .then( result => {
        console.log( 'Connected to MongoDB' )
    })
    .catch( error => {
        console.log( 'error connecting to MongoDB: ', error.message )
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 5,
        required: true
    },
    number: {
        type: Number,
        min: 10,
        required: true
    },
    important: Boolean
})

personSchema.set( 'toJSON', {
    transform: ( document, returnedObject ) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model( 'Person', personSchema )