import mongoose, { Schema } from 'mongoose';

const CartItemSchema = new Schema({
    itemId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    }
});

const FacturaSchema = mongoose.Schema({
    noFactura: {
        type: Number,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nameUser: {
        type: String,
        required: [true, 'El nombre del Usuario es obligatorio'],
        unique: true
    },
    fechaCompra: {
        type: Date,
        default: Date.now
    },
    cart: [CartItemSchema],
    total: {
        type: Number,
        required: [true, 'El total es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
});

export default mongoose.model('Factura', FacturaSchema);
