import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    student_name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    class: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    attendance_time: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    date: {
        type: mongoose.Schema.Types.String,
        required: true
    }
});

export const Student = mongoose.model("Student", studentSchema);