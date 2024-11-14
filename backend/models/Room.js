const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: String,
  image: String,
  sleeps: Number,
  bed: String,
  price: Number,
  left: Number,
  details: {
    type: [{ 
      type: String,
      required: true
    }],
    required: true
  },
});

module.exports = mongoose.model('Room', roomSchema);

