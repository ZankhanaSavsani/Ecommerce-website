const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // index: true
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    street: {
        type: String,
        default: '',
    },
    apartment: {
        type: String,
        default: '',
    },
    zip: {
        type: Number,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    otpHash:{
        type: String,
        default: '', 
    },
    otpExpiresIn:{
        type: Date,
        default: null,
    }
});

// If you want to explicitly create an index programmatically:
//userSchema.index({ email: 1 }, { unique: true });


// Create a virtual field 'id' that returns the string representation of the _id field
userSchema.virtual('id').get(function (){
    return this._id.toHexString();
});

// Configure the schema to include virtuals when converting documents to JSON
userSchema.set('toJSON',{
    virtuals: true,
});

exports.User = mongoose.model('User',userSchema);
exports.userSchema = userSchema;
