const mongoose = require('mongoose');

// Define the schema for the Product model
const productSchema = mongoose.Schema({
    // id: String,
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    images: [{
        type: String,
    }],
    brand: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        default: 0,
    },
    // Category ID, references the Category model
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews:{
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        required: false,
    },
    dataCreated: {
        type: Date,
        default: Date.now,
    },   
})

// Create a virtual field 'id' that returns the string representation of the _id field
productSchema.virtual('id').get(function (){
    return this._id.toHexString();
});

// Configure the schema to include virtuals when converting documents to JSON
productSchema.set('toJSON',{
    virtuals: true,
});

exports.Product = mongoose.model('Product',productSchema);
