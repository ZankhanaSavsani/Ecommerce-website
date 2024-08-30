const mongoose = require('mongoose');

// Define the schema for the Category model
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    } ,
    icon:{
        type: String,
    },
    color:{
        type: String,
    }
});

// Create a virtual field 'id' that returns the string representation of the _id field
categorySchema.virtual('id').get(function (){
    return this._id.toHexString();
});

// Configure the schema to include virtuals when converting documents to JSON
categorySchema.set('toJSON',{
    virtuals: true,
});

exports.Category = mongoose.model('Category',categorySchema);
