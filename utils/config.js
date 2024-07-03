require( 'dotenv' ).config()

const PORT = process.env.PORT
const MONGODBURL = process.env.MONGODBURL

module.exports = {
    MONGODBURL, 
    PORT
}