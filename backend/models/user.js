const mongoose = require('mongoose');

// A schema is a blueprint for the data.
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true, // No two users can have the same email
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  // These fields are needed for the OTP functionality
  passwordResetOTP: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
}, {
  // Automatically add 'createdAt' and 'updatedAt' fields
  timestamps: true,
});

// A model is a wrapper on the schema that allows you to interact with the database.
// This line creates the 'User' model and exports it so other files can use it.
module.exports = mongoose.model('User', UserSchema);