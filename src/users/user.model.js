import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    email: {
        type: String,
        required: [true, 'The email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password is required']
    },
    rol: {
        type: String, 
        required: true, 
        default: 'CLIENTE_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    cart: {
        type: Array,
        default: []
    }
});

export default mongoose.model('User', UserSchema);