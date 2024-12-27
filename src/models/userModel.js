import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    minlength: [3, 'Name must be at least 3 characters long.'],
    maxlength: [50, 'Name cannot exceed 50 characters.']
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Email is not valid.']
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters long.']
  },
  phone: {
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    type: String,
    maxlength: [200, 'Address cannot exceed 200 characters.']
  },
  role: {
    type: String,
    enum: ['user', 'maid', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema)
export default User;
