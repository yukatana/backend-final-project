// The factory returns an instance of a DAO class which extends to the chosen container type
const ProductDAO = require('../factories/DAOFactory').getProductDAO()
const { ProductDTO } = require('../DTOs')
const { logger } = require('../../logs')

getProductById = async (req, res) => {
    const id = req.params.id
    if (id) {
        let product = await ProductDAO.getById(id)
        if (!product) {
            return res.status(404).json({error: 'Product not found.'})
        }
        // toClient() method returns only name, thumbnail, price, and stock
        product = new ProductDTO(product)
        return res.status(200).json(product)
    } else {
        let data = await ProductDAO.getAll()
        // evaluates whether the query returned any data
        if (data) {
            data.map(product => {return new ProductDTO(product)})
            return res.status(200).json(data)
        }
        return res.status(404).json({error: 'No products were found on the database.'})
    }
}

getByCategory = async (req, res) => {
    try {
        if (!req.params.category) {
            return res.status(400).json({error: `BAD REQUEST - please specify a category parameter.`})
        }
        const category = req.params.category
        let products = await ProductDAO.filter('category', category)
        if (!products) {
            return res.status(404).json({error: `No products match your filter for category ${category}.`})
        }
        // Mapping products to ProductDTO
        products.map(product => {return new ProductDTO(product)})
        return res.status(200).json(products)
    } catch (err) {
        logger.error(err)
    }
}

addProduct = async (req, res) => {
    const product = {
        dateString: new Date().toLocaleString(),
        // Description and stock fields are optional, so defaults are assigned in the controller to avoid cluttering DAOs
        description: req.body.description || null,
        stock: req.body.stock || 0,
        ...req.body
    }
    // VERIFY IF PRODUCT ALREADY EXISTS
    const productAlreadyExists = await ProductDAO.filter('name', product.name)
    if (productAlreadyExists) {
        res.status(406).json({error: `A product with name '${product.name}' already exists.`})
    }
    const newProduct = await ProductDAO.save(product)
    logger.info(`New product successfully added - ${newProduct}`)
    res.status(201).json(new ProductDTO(newProduct))
}

updateProductById = async (req, res) => {
    const id = req.params.id
    const update = {
        dateString: new Date().toLocaleString(),
        ...req.body
    }
    const updatedProduct = await ProductDAO.updateItem(id, update)
    logger.info(`Product successfully updated - ${updatedProduct}`)
    // Guard clause evaluates whether there was an ID match (null is returned from the DAO if not, hence returning 404)
    if (updatedProduct === null) {
        return res.status(404).json({error: 'Product not found.'})
    }
    return res.status(200).json(new ProductDTO(updatedProduct))
}

deleteProductById = async (req, res) => {
    const id = req.params.id
    const success = await ProductDAO.deleteById(id)
    if (success) {logger.info(`Product ID: ${id} has been deleted successfully.`)}
    success ?
        res.status(200).json({message: `Product ID: ${id} has been deleted.`})
        : res.status(404).json({error: 'Product not found'})
}

module.exports = {
    getProductById,
    addProduct,
    updateProductById,
    deleteProductById,
    getByCategory
}