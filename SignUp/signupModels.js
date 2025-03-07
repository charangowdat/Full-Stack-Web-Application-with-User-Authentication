const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const signupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must have the name'],
    trim: true,
    maxlength: [40, 'A name must have less or equal 40 characters'],
  },
  email: {
    type: String,
    required: [true, 'A User must have the email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Pleass provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
});

signupSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

signupSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
}

const Signup = mongoose.model('SignUp', signupSchema);

module.exports = Signup;
