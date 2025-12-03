/*Funkciók:
1.	Feladat hozzáadása
o	Új feladat beviteli mező és „Hozzáadás” gomb a főcím alatt.
o	Az új feladat alapértelmezettként a „Teendő” oszlopba kerül.
2.	Oszlopok
o	„Teendő” (a kártya színe: beige)
o	„Folyamatban” (kék háttér)
o	„Kész” (zöld háttér)
3.	Drag & Drop
o	Feladatok húzása az oszlopok között.
o	Húzáskor a feladat színe változik az oszlophoz igazodva.
4.	Feladat törlése
o	Minden feladat mellett legyen törlés gomb („X”).
5.	Feladat áthelyezése
o	Minden feladat áthúzással áthelyezhető a másik állapot-dobozba.
6.	Adatmentés
o	A feladatok és állapotuk mentése localStorage-ba.
o	Az oldal újratöltésekor az adatok visszaolvasása és megjelenítése

*/
document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const todoColumn = document.getElementById('todoColumn');
    const inProgressColumn = document.getElementById('inProgressColumn');
    const doneColumn = document.getElementById('doneColumn');

    // Load tasks from localStorage
    loadTasks();    
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const task = createTaskElement(taskText, 'todo');
            todoColumn.appendChild(task);
            taskInput.value = '';
            saveTasks();
        }
    });

    function createTaskElement(text, status) {
        const task = document.createElement('div');
        task.className = 'task';
        task.draggable = true;
        task.textContent = text;
        task.style.backgroundColor = getStatusColor(status);
        task.dataset.status = status;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.className = 'deleteBtn';
        deleteBtn.addEventListener('click', () => {
            task.remove();
            saveTasks();
        });

        task.appendChild(deleteBtn);
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);
        return task;
    }
    function getStatusColor(status) {
        switch (status) {
            case 'todo':
                return 'beige';
            case 'inProgress':
                return 'lightblue';
            case 'done':
                return 'lightgreen';    
            default:
                return 'white';
        }   
    }

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.textContent);
        e.dataTransfer.effectAllowed = 'move';
        this.classList.add('dragging');
    }
    function dragEnd(e) {
        this.classList.remove('dragging');
    }
    [todoColumn, inProgressColumn, doneColumn].forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        column.addEventListener('drop', e => {
            e.preventDefault();
            const taskText = e.dataTransfer.getData('text/plain').slice(0, -1);
            const status = column.id === 'todoColumn' ? 'todo' : column.id === 'inProgressColumn' ? 'inProgress' : 'done';
            const task = createTaskElement(taskText, status);
            column.appendChild(task);
            saveTasks();
        });
    });
    function saveTasks() {
        const tasks = [];
        [todoColumn, inProgressColumn, doneColumn].forEach(column => {
            const status = column.id === 'todoColumn' ? 'todo' : column.id === 'inProgressColumn' ? 'inProgress' : 'done';
            Array.from(column.children).forEach(task => {
                tasks.push({ text: task.textContent.slice(0, -1), status });
            }
            );
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }   
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(({ text, status }) => {
            const task = createTaskElement(text, status);
            if (status === 'todo') {
                todoColumn.appendChild(task);
            } else if (status === 'inProgress') {
                inProgressColumn.appendChild(task);
            } else if (status === 'done') {
                doneColumn.appendChild(task);
            }
        });
    }
});
