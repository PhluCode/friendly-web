const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  bookings: [{ 
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    bookDate: { type: Date, required: true },
    nightCount: { type: Number, required: true },
    roomCount: { type: Number, required: true },
    roomId: { type: String, required: true},
    roomType: { type: String, required: true },
    bedCount: { type: String, required: true },
    guestCount: { type: Number, required: true },
    pricePerRoom: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  }],
  bookingID: {type : Number, required : true, default: 0}
});

const User = mongoose.model('User', userSchema);
module.exports = User;
