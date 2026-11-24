const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'mahasiswa'],
    default: 'mahasiswa'
  },
  mahasiswaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mahasiswa',
    required: function() {
      return this.role === 'mahasiswa';
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);