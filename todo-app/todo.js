const noteFilter = document.getElementById('note-filter');
const addNoteBtn = document.getElementById('add-note-btn');
const notes = document.querySelector('.notes');

const state = {
    todos: [],
    filter: 'all'
};

/**
 * Loads the saved state stored within local storage.
 */
function loadState() {
    const saved = localStorage.getItem('todo-state');
    if (saved) {
        state.todos = JSON.parse(saved);
    }
}

/**
 * Saves the current state within local storage.
 */
function saveState() {
    localStorage.setItem('todo-state', JSON.stringify(state.todos));
}

/**
 * Filters the entire state of todos based on the currently active filter.
 * 
 * @returns {Array<Object>} - The filtered array of todos.
 */
function filterTodos() {
    if (state.filter === 'all') return state.todos;
    return state.todos.filter(todo => todo.status === state.filter);
}

/**
 * Rendered to the DOM when no relevant todos are present.
 */
function renderNoNotes() {
    notes.innerHTML = '';
    const noNote = document.createElement('p');

    noNote.className = 'no-notes';
    noNote.innerHTML = "You have no notes to render. Please consider adding, or completing a preexisting todo."

    notes.appendChild(noNote);
}

/**
 * Renders an array of todos to the DOM.
 * 
 * @param {Array<Object>} todos - The provided array if todos.
 */
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

/**
 * Refreshes the UI based on the current state of the filtered todos.
 * 
 * @returns {void} - If no todos are present.
 */
function refreshUI() {
    const filtered = filterTodos();

    if (filtered.length === 0) {
        renderNoNotes();
        return;
    }
    
    renderNotes(filtered);
}

/**
 * Updates the active todo filter and re-renders the UI.
 *
 * @param {'all' | 'complete' | 'incomplete'} newFilter - The filter mode to apply.
 */
function setFilter(newFilter) {
    state.filter = newFilter;
    refreshUI();
}

/**
 * Adds a new note to the array of todos, subsequently persisting it to local storage.
 */
function addNote() {
    const title = prompt("Please provide a title for your todo.");
    if (!title) return;

    const note = {
        id: crypto.randomUUID(),
        title: title,
        status: 'incomplete',
        content: 'Lorem ipsum.'
    }

    state.todos.push(note);
    saveState();
    refreshUI();
}

/**
 * Removes a todo from the state by its ID, persists to local storage.
 * 
 * @param {string} todoId - The UUID of the todo to delete.
 */
function deleteNote(todoId) {
    state.todos = state.todos.filter(todo => todo.id !== todoId);
    saveState();
    refreshUI();
}

/**
 * Toggles the completeness status of a todo, based on its given UUID. Persists to local storage.
 * 
 * @param {string} todoId - The UUID of the todo to toggle.
 * @returns {void}
 */
function toggleNote(todoId) {
    const todo = state.todos.find(todo => todo.id === todoId);
    if (!todo) return;

    todo.status = todo.status === 'complete' ? 'incomplete' : 'complete';

    saveState();
    refreshUI();
}

/**
 * Edits the title of the todo based on it's provided UUID, persists to local storage.
 * 
 * @param {string} todoId - The UUID of the todo to edit.
 * @returns {void}
 */
function editTitle(todoId) {
    const todo = state.todos.find(todo => todo.id === todoId);
    if (!todo) return;

    const title = prompt("Please provide a new title for your todo.");
    if (!title) return;

    todo.title = title;
    saveState();
    refreshUI();
}

/**
 * Edits the content of the todo based on it's provided UUID, persists to local storage.
 * 
 * @param {string} todoId - The UUID of the todo to edit.
 * @returns {void}
 */
function editContent(todoId) {
    const todo = state.todos.find(todo => todo.id === todoId);
    if (!todo) return;

    const content = prompt("Please provide a new description for your todo.");
    if (!content) return;

    todo.content = content;
    saveState();
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
    loadState();
    refreshUI();
});