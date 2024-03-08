import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
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
    }
})

export default mongoose.model('Category', CategorySchema);