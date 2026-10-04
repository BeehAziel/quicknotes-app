const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

const STORAGE_KEY = "notesToolkitNotes";

let notes = loadNotes();

function loadNotes() {
  try {
    const savedNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(savedNotes) ? savedNotes : [];
  } catch {
    return [];
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function updateCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

function render() {
  notesList.replaceChildren();

  const query = searchInput.value.trim().toLowerCase();
  const visibleNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(query)
  );

  if (visibleNotes.length === 0 && query) {
    const message = document.createElement("li");
    message.className = "empty-search";
    message.textContent = "No notes match your search.";
    notesList.append(message);
  } else {
    visibleNotes.forEach((note) => {
      const card = document.createElement("li");
      const categoryClass = note.category.toLowerCase();

      card.classList.add("note-card", `category-${categoryClass}`);

      const text = document.createElement("p");
      text.className = "note-text";
      text.textContent = note.text;

      const meta = document.createElement("div");
      meta.className = "note-meta";

      const category = document.createElement("span");
      category.className = "category-label";
      category.textContent = note.category;

      const date = document.createElement("time");
      date.textContent = note.createdAt;

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", `Delete note: ${note.text}`);
      deleteButton.addEventListener("click", () => deleteNote(note.id));

      meta.append(category, date, deleteButton);
      card.append(text, meta);
      notesList.append(card);
    });
  }

  updateCount();
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();

  if (!text) {
    errorMessage.textContent = "Please type a note first.";
    noteInput.focus();
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    noteInput.focus();
    return;
  }

  errorMessage.textContent = "";

  notes.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString(),
  });

  saveNotes();
  noteInput.value = "";
  render();
  noteInput.focus();
});

searchInput.addEventListener("input", render);

render();