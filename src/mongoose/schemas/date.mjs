import mongoose from 'mongoose';

const dateSchema = new mongoose.Schema({
    date: {
        type: mongoose.Schema.Types.String,
        required: true
    }
});

export const LastDate = mongoose.model('LastDate', dateSchema);