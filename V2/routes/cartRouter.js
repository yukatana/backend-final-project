const { Router } = require("express")
const fs = require ("fs")

const Container = require("../containers/fileContainer")

const productContainer = new Container('database.json')
const cartContainer = new Container('cart.json')

const cartRouter = new Router()
const authMiddleware = require('../utils/authMiddleware')

cartRouter.post("/", authMiddleware, async (req, res) => {
    const newCart = await cartContainer.save({
        timestamp: Date.now(),
        products: []
    })
    res.status(201).json({message: `A new cart has been created with ID: ${newCart.id}.`})
})

cartRouter.delete("/:id", authMiddleware, async (req, res) => {
    const success = await cartContainer.deleteById(req.params.id)
    success ?
    res.status(200).json({message: `Cart ID: ${req.params.id} has been deleted.`})
    : res.status(400).json({error: "Cart not found"})
})

cartRouter.get("/:id/products", async (req, res) => {
    const cart = await cartContainer.getById(req.params.id)
    if (!cart) {
        res.status(400).json({error: "Cart not found"})
    } else {
        res.status(200).json(cart.products)
    }
})

cartRouter.post("/:id/products/:product_id", authMiddleware, async (req, res) => {
    const allCarts = await cartContainer.getAll()
    const product = await productContainer.getById(req.params.product_id)
    const targetCartIndex = allCarts.findIndex(e => e.id == req.params.id)

    if (product && targetCartIndex != -1) {
        allCarts[targetCartIndex].products.push(product)
        cartContainer.saveCarts(allCarts)
        res.status(200).json({message: `Product ID: ${req.params.product_id} has been added to cart ID: ${req.params.id}`})
    } else {
        res.status(404).json({error: `Either cart ID: ${req.params.id} or product ID: ${req.params.product_id} does not exist.`})
    }
})

cartRouter.delete("/:id/products/:product_id", authMiddleware, async (req, res) => {
    const allCarts = await cartContainer.getAll()
    const targetCartIndex = allCarts.findIndex(e => e.id == req.params.id)
    const targetProductIndex = allCarts[targetCartIndex].products.findIndex(e => e.id == req.params.product_id)

    if (targetCartIndex != -1 && targetProductIndex != -1) {
        allCarts[targetCartIndex].products.splice(targetProductIndex, 1)
        cartContainer.saveCarts(allCarts)
        res.status(200).json({message: `Product ID: ${req.params.product_id} has been deleted from cart ID: ${req.params.id}`})
    } else {
        res.status(404).json({error: `Either cart ID: ${req.params.id} does not exist or product ID: ${req.params.product_id} was not in that cart.`})
    }
})

module.exports = cartRouter