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
    const addTaskBtn = document.getElementById('hozzaadGomb');
    const taskInput = document.getElementById('ujFeladatInput');
    const teendoFeladatok = document.getElementById('teendoFeladatok');
    const folyamatbanFeladatok = document.getElementById('folyamatbanFeladatok');
    const keszFeladatok = document.getElementById('keszFeladatok');

    const teendoBox = document.getElementById('Teendobox');
    const folyamatbanBox = document.getElementById('Folyamatbanbox');
    const keszBox = document.getElementById('Keszbox');

    // Load tasks from localStorage
    loadTasks();    
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const task = createTaskElement(taskText, 'teendo');
            teendoFeladatok.appendChild(task);
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
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // <-- EZ FONTOS!
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
            case 'teendo':
                return 'beige';
            case 'folyamatban':
                return 'lightblue';
            case 'kesz':
                return 'lightgreen';    
            default:
                return 'white';
        }   
    }

    let draggedTask = null;

    function dragStart(e) {
        draggedTask = this;
        e.dataTransfer.effectAllowed = 'move';
        this.classList.add('dragging');
    }
    function dragEnd(e) {
        this.classList.remove('dragging');
        draggedTask = null;
    }

    [
        { box: teendoBox, column: teendoFeladatok, status: 'teendo' },
        { box: folyamatbanBox, column: folyamatbanFeladatok, status: 'folyamatban' },
        { box: keszBox, column: keszFeladatok, status: 'kesz' }
    ].forEach(({ box, column, status }) => {
        box.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        box.addEventListener('drop', e => {
            e.preventDefault();
            if (draggedTask) {
                draggedTask.style.backgroundColor = getStatusColor(status);
                draggedTask.dataset.status = status;
                column.appendChild(draggedTask);
                saveTasks();
            }
        });
    });
    function saveTasks() {
        const tasks = [];
        [teendoFeladatok, folyamatbanFeladatok, keszFeladatok].forEach(column => {
            let status = 'teendo';
            if (column.id === 'folyamatbanFeladatok') status = 'folyamatban';
            else if (column.id === 'keszFeladatok') status = 'kesz';
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
            if (status === 'teendo') {
                teendoFeladatok.appendChild(task);
            } else if (status === 'folyamatban') {
                folyamatbanFeladatok.appendChild(task);
            } else if (status === 'kesz') {
                keszFeladatok.appendChild(task);
            }
        });
    }
});
