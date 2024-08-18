const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

exports.Category = mongoose.model('Category',categorySchema);
