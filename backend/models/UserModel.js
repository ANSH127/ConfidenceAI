
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validtor= require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


userSchema.statics.signup= async function(name, email, password) {

    // Validation
    if (!name || !email || !password) {
        throw new Error('All fields must be filled');
    }
    if (!validtor.isEmail(email)) {
        throw new Error('Email is not valid');
    }
    

    const exists = await this.findOne({ email });
    if (exists) {
        throw new Error('Email already in use');
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const user = await this.create({ name, email, password: hash });
    return user;
};

userSchema.statics.login = async function(email, password) {
    // Validation
    if (!email || !password) {
        throw new Error('All fields must be filled');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error('Incorrect password');
    }
    return user;
}


const User = mongoose.model('User', userSchema);

module.exports = User;


