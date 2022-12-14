//Memory-based data handling class for ephemeral data.
const { logger } = require('../../logs')

class MemoryDAO {

    constructor() {
        this.data = []
    }

    // Useful for getting document count in order to assign order numbers
    getCount = () => {
        return this.data.length
    }

    save = (object) => {
        if (this.data.length > 0) {
            object.id = this.data[this.data.length-1].id+1
            this.data.push(object)
        } else {
            object.id = 1
            this.data.push(object)
        }
        return object
    }

    // filters a collection by key value pairs, or null if it does not exist
    filter = async (key, value) => {
        const data = this.data
        const result = data.filter(e => e[key] === value)
        if (result.length === 0) {
            return null
        }
        return result
    }

    updateItem = async (id, item) => { //saves all items when one of them has been edited
        try {
            const isValid = this.data.findIndex(el => el.id == id)
            if (isValid != -1) {
                this.data[isValid].dateString = new Date().toLocaleString()
                this.data[isValid].name = item.name || this.data[isValid].name
                this.data[isValid].category = item.category || this.data[isValid].category
                this.data[isValid].description = item.description || this.data[isValid].description
                this.data[isValid].thumbnail = item.thumbnail || this.data[isValid].thumbnail
                this.data[isValid].price = item.price || this.data[isValid].price
                this.data[isValid].stock = item.stock || this.data[isValid].stock
                return this.data
            }
            // Returns null when no match is found for the id param
            return null
        } catch (err) {
            logger.error(err)
        }
    }

    getById = async (id) => { //returns the object specified by the ID passed as an argument, or null if it does not exist
        const item = await this.data.find(el => el.id == id)
        if (item) {
            return item
        }
        else {
            return null
        }
    }

    getAll = () => { //returns entire array in memory
        return this.data
    }

    deleteById = async (id) => { //deletes array item (object) specified by ID
        if (this.data.find(el => el.id == id)) {
            this.data.splice(this.data.indexOf(this.data.find(el => el.id == id)), 1)
            logger.info('The item containing the specified ID has been deleted.')
            return true
            }
        else {
            logger.info('The specified ID does not match any items.')
            return null
        }
    }

    pushToProperty = (id, item, property) => {
        try {
            const data = this.data
            const targetIndex = data.findIndex(e => e.id == id)
            if (item && targetIndex !== -1) {
                data[targetIndex][property].push(item)
                return data[targetIndex]
            }
            // Null is returned if no item is passed or if the passed id does not match any items
            return null
        } catch (err) {
            logger.error(err)
        }
    }

    // First parameter is the ID of the document in this collection, the second is an object with the property's ID and name to delete from - allows re-usability
    deleteFromPropertyById = async (parentId, property) => {
        //executed when calling this method while using memory or file-based persistence, since assigned IDs are numeric
        if (!isNaN(parentId)) {
            const data = this.data
            // Getting the index of the object to delete from
            const targetObjectIndex = data.findIndex(e => e.id == parentId)
            // Getting the index of the object in the target property to delete from in the parent array
            const targetIndexInProperty = data[targetObjectIndex][property.name].findIndex(e => e.id == property.id)
            if (targetObjectIndex !== -1 && targetIndexInProperty !== -1) {
                data[targetObjectIndex][property.name].splice(targetIndexInProperty, 1)
                this.data = data
                return data[targetObjectIndex][property.name]
            }
            return null
        }
    }

    deleteAll = () => { //deletes all objects in the file and replaces them with an empty array
        this.data = []
        logger.info("All items have been deleted.")
    }
}

module.exports = MemoryDAO