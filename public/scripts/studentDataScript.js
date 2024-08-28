const classes = document.getElementById('classes');
const date = document.getElementById('student-date');
const table = document.getElementById('table');
const filterBtn = document.getElementById('filter');
const searchBar = document.getElementById('search-student');
const searchBtn = document.getElementById('search');
const exportBtn = document.getElementById('export-btn');

const setTable = (item) => {
    const studId = document.createElement('div');
    const studName = document.createElement('div');
    const time = document.createElement('div');
    const editBtn = document.createElement('button');

    studId.classList.add('data');

    time.classList.add('attendance-time');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');

    studId.textContent = item.studentId;
    studName.textContent = item.student_name;
    time.textContent = item.attendance_time;

    editBtn.setAttribute('studId', item.studentId);
    
    time.appendChild(editBtn);      
    
    editBtn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('studId');
        console.log(id);  
        let timeString;              

        const timeTag = document.createElement('input');
        const submitBtn = document.createElement('button');
        submitBtn.classList.add('edit-btn');
        timeTag.type = 'time';  
        timeTag.style = 'height: 1.7rem';  
        timeTag.required = true;         

        time.textContent = ' ';
        submitBtn.textContent = 'Update';

        time.appendChild(timeTag);
        time.appendChild(submitBtn);                               
        
        timeTag.addEventListener('input', () => {
            timeString = timeTag.value;
        });
        
        submitBtn.addEventListener('click', async () => {
            const putData = { id: id, time: timeString };

            try {
                const res = await fetch('http://localhost:5000/api/student', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(putData)
                });  
                
                if(!res.ok)
                    throw new Error('There is a problem');                                               

                time.textContent = timeString;

            } catch (err) {
                console.log(err);                        
            }
            
        }); 

    });

    table.appendChild(studId);
    table.appendChild(studName);
    table.appendChild(time);        
}

const getData = async () => {   
    const selectedClass = classes.value;
    const classDate = date.value;

    const dateObj = new Date(classDate);

    const formattedDate = ('0' + (dateObj.getDate())).slice(-2) + '/' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '/' + dateObj.getFullYear();

    try {
        const res = await fetch('http://localhost:5000/api/getClass?class=' + selectedClass + '&date=' + formattedDate, {
            method: 'GET'
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const getClass = await res.json();

        table.textContent = '';        

        getClass.forEach(item => {
            setTable(item);
        });

    } catch (err) {
        console.error(err);
    } 
}

const exportData = async () => {
    const selectedClass = classes.value;
    const classDate = date.value;

    const dateObj = new Date(classDate);

    const formattedDate = ('0' + (dateObj.getDate())).slice(-2) + '/' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '/' + dateObj.getFullYear();

    try {
        const res = await fetch('http://localhost:5000/api/getClass?class=' + selectedClass + '&date=' + formattedDate, {
            method: 'GET'
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const getClass = await res.json();

        const classData = getClass.map((student) => ({
            studentId: student.studentId,
            student_name: student.student_name,
            attendance_time: student.attendance_time
        }));

        const data = [...classData];
        const fileName = 'student_attendance';
        const exportType = exportFromJSON.types.csv;
        
        window.exportFromJSON({ data, fileName, exportType });
    } catch (err) {
        console.log(err);
    }
}

const searchStudent = async () => {
    try {
        table.textContent = '';

        const student = searchBar.value;

        const res = await fetch('http://localhost:5000/api/theStudent/' + student, {
            method: 'GET'
        });

        if(!res.ok){
            throw new Error('Problem fetching data');
        }            

        const getOneStudent = await res.json();        

        getOneStudent.forEach(item => {
            setTable(item);
        });

    } catch (err) {
        console.log(err);
    }
}

filterBtn.addEventListener('click', getData);
exportBtn.addEventListener('click', exportData);
searchBtn.addEventListener('click', searchStudent);
