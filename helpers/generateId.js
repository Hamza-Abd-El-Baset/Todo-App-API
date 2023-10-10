
const generateId = async (model) =>{
    const filteredElements = await model.find({
    // No Search Filters
    },
    ['ID','name'], // Columns to Return
    {
        skip:0, // Starting Row
        limit:1, // Ending Row
        sort:{
            ID: -1 //Sort by ID DESC
        }
    }
    )

    const lastElement = filteredElements[0]
    const lastId = lastElement?.ID
    const id = (lastId || 0) + 1
    return id
}

module.exports = generateId