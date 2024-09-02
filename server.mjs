import express from 'express';
import mongoose from 'mongoose';
import { Student } from './src/mongoose/schemas/students.mjs';
import { LastDate } from './src/mongoose/schemas/date.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
const app = express();

const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: '*'
    })
);

mongoose.connect('mongodb://127.0.0.1/student_attendance')
.then(() => console.log('Connected to database'))
.catch((err) => console.log(err));

const dateId = '66a4ddb5f4a9020c584e0515'; //add your own id for your date from mongodb

const date = new Date();
const currDate = ('0' + (date.getDate())).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();

const updateData = async () => {  
    try {  

        const lastDate = await LastDate.findById(dateId);

        if(lastDate.date !== currDate){
            const currData = await Student.find({ date: '09/08/2024' }); //change it to where the data can be duplicated
           
            const newData = currData.map((student) => ({
                studentId: student.studentId,
                student_name: student.student_name,
                class: student.class,
                attendance_time: '-',
                date: currDate
            }));

            await Student.insertMany(newData);
           

            await LastDate.findByIdAndUpdate(dateId, { $set: { date: currDate} });
        }      

    } catch (err) {
        console.log(err);
    }
};

updateData();

app.get('/', (req, res) => {
    return res.status(200).sendFile(path.resolve(__dirname, 'public/html/studentData.html'));
});

app.get('/api/getClass', async (req, res) => {
    const className = req.query.class;
    const classDate = req.query.date;

    const filteredClass = await Student.find({ class: className, date: classDate });

    return res.status(200).json(filteredClass);    
});

app.get('/api/student/:id', async (req, res) => {
    const { params: { id } } = req;
    
    let date = new Date();
    let currTime = date.toLocaleTimeString('en-GB',{ hour: '2-digit', minute: '2-digit' });
    
    try {
        const findStudent = await Student.findOne({ studentId: id, date: currDate });        
        findStudent.attendance_time = currTime;
        await findStudent.save();
        //return res.status(200).send('<h1>OK</h1>');
        return res.status(200).sendFile(path.resolve(__dirname, 'public/html/VerifyPage.html'));
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

app.put('/api/student', async (req, res) => {
    const { body } = req;
    
    try {
        await Student.findOneAndUpdate({ studentId: body.id, date: currDate }, {
            attendance_time: body.time
        });
    
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

app.get('/api/theStudent/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const findStudent = await Student.find({ student_name: {$regex: '^' + name, $options: 'i'}, date: currDate });
        return res.status(200).json(findStudent);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

app.get('/api/student', async (req, res) => {
    const { filter } = req.query;

    try {
        const filteredData = await Student.find({ class: filter });

        return res.status(200).json(filteredData);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

app.listen(PORT, () => {
    console.log('connected to localhost 5000');
})