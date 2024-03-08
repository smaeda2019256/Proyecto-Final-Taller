import mongoose, { mongo } from "mongoose";

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true , 'The name is required'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: { type: String },
    disponible: { type: Boolean, default: true },
});

export default mongoose.model('Producto', ProductSchema);