// Database and Twilio credentials loaded in .env
require('dotenv').config()

// Set up port from CLI command on startup
const args = require('yargs')(process.argv.slice(2))
    .alias({
        p: 'port',
        m: 'mode'
    })
    .default({
        port: 8080,
        mode: 'fork'
    })
    .argv

// Database declaration for each entity from environment
const PRODUCT_DATABASE = process.env.PRODUCTS_DATABASE
const CART_DATABASE = process.env.CARTS_DATABASE
const MESSAGE_DATABASE = process.env.MESSAGE_DATABASE
const ORDER_DATABASE = process.env.ORDER_DATABASE

// For MongoDB
const MONGODB_USERNAME = process.env.MONGODB_USERNAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DATABASE = process.env.MONGODB_DATABASE

// For Twilio and SendGrid
const TWILIO_SID = process.env.TWILIO_SID
const TWILIO_TOKEN = process.env.TWILIO_TOKEN
const TWILIO_PHONE = process.env.TWILIO_PHONE
const MY_PHONE = process.env.MY_PHONE
const MY_EMAIL = process.env.MY_EMAIL
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

// SENSITIVE: JWT secret key
const JWT_KEY = process.env.JWT_KEY

const PORT = process.env.PORT || args.port //takes environment port to be assigned by deployment container
const MODE = args.mode

module.exports = {
    PRODUCT_DATABASE,
    CART_DATABASE,
    MESSAGE_DATABASE,
    ORDER_DATABASE,
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    MONGODB_URI,
    MONGODB_DATABASE,
    TWILIO_SID,
    TWILIO_TOKEN,
    TWILIO_PHONE,
    MY_PHONE,
    MY_EMAIL,
    SENDGRID_API_KEY,
    PORT,
    MODE,
    JWT_KEY
}