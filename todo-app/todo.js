const noteFilter = document.getElementById('note-filter');
const addNoteBtn = document.getElementById('add-note-btn');
const notes = document.querySelector('.notes');

const state = {
    todos: [],
    filter: 'all'
};

function setFilter(newFilter) {
    state.filter = newFilter;
    refreshUI();
}

function filterTodos() {
    if (state.filter === 'all') return state.todos;
    return state.todos.filter(todo => todo.status === state.filter);
}

function renderNotes(todos) {
    notes.innerHTML = '';

    for (const todo of todos) {
        const card = document.createElement('div');
        card.className = 'note';
        card.dataset.id = todo.id;

        const titleH2 = document.createElement('h2');
        titleH2.className = 'note-title';
        const titleText = document.createElement('span');
        titleText.className = 'note-title-text';
        titleText.textContent = todo.title;
        titleH2.appendChild(titleText);

        const statusSpan = document.createElement('span');
        statusSpan.className = todo.status;
        statusSpan.textContent = todo.status.charAt(0).toUpperCase() + todo.status.slice(1);
        titleH2.appendChild(statusSpan);

        const contentP = document.createElement('p');
        contentP.textContent = todo.content;

        const divider = document.createElement('hr');
        divider.className = 'note-divider';

        const actions = document.createElement('div');
        actions.className = 'note-actions';
        actions.innerHTML = `
            <button type="button" class="toggle-note-btn">Toggle</button>
            <button type="button" class="edit-title-btn">Edit Title</button>
            <button type="button" class="edit-content-btn">Edit Content</button>
            <button type="button" class="delete-note-btn">Delete</button>
        `;

        card.appendChild(titleH2);
        card.appendChild(contentP);
        card.appendChild(divider);
        card.appendChild(actions);
        notes.appendChild(card);
    }
}

function renderNoNotes() {
    notes.innerHTML = '';
    const noNote = document.createElement('p');

    noNote.className = 'no-notes';
    noNote.innerHTML = "You have no notes to render. Please consider adding, or completing a preexisting todo."

    notes.appendChild(noNote);
}

function refreshUI() {
    const filtered = filterTodos();

    if (filtered.length === 0) {
        renderNoNotes();
        return;
    }
    
    renderNotes(filtered);
}

function addNote() {
    const note = {
        id: crypto.randomUUID(),
        title: 'Placeholder title',
        status: 'incomplete',
        content: 'Lorem ipsum.'
    }

    state.todos.push(note);
    refreshUI();
}

function deleteNote(todoId) {
    state.todos = state.todos.filter(todo => todo.id !== todoId);
    refreshUI();
}

function toggleNote(todoId) {
    const todo = state.todos.find(todo => todo.id === todoId);
    if (!todo) return;

    todo.status = todo.status === 'complete' ? 'incomplete' : 'complete';
    refreshUI();
}

function editTitle(todoId) {
    const todo = state.todos.find(todo => todo.id === todoId);
    if (!todo) return;

    const title = prompt("Please provide a new title for your todo.");
    if (!title) return;

    todo.title = title;
    refreshUI();
}

function editContent(todoId) {
    const todo = state.todos.find(todo => todo.id === todoId);
    if (!todo) return;

    const content = prompt("Please provide a new description for your todo.");
    if (!content) return;

    todo.content = content;
    refreshUI();
}

addNoteBtn.addEventListener('click', () => {
    addNote();
});

noteFilter.addEventListener('change', (e) => {
    setFilter(e.target.value);
});

notes.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const card = btn.closest('.note');
    const id = card.dataset.id;

    if (btn.classList.contains('toggle-note-btn'))      toggleNote(id);
    if (btn.classList.contains('edit-title-btn'))       editTitle(id);
    if (btn.classList.contains('edit-content-btn'))     editContent(id);
    if (btn.classList.contains('delete-note-btn'))      deleteNote(id);
});

document.addEventListener('DOMContentLoaded', () => {
    refreshUI();
});