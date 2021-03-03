//system/core modules
const fs = require('fs'); //file system

const addNotes = (title, body, callback) => {
    const notes = loadNotes();
    const titleAlreadyExists = notes.find((note) => note.title === title); //return the note/object

    if (!titleAlreadyExists) {
        notes.push({
            title: title,
            body: body
        });
        saveNotes(notes);
        callback({
            message: "Note has been added",
        });
    } else {
        callback({
            error: "There exist a note with the given title. Try a different one.",
        });
    }
}
const removeNotes = (title, callback) => {
    const notes = loadNotes();
    const newNotes = notes.filter((note) => note.title !== title); //returns an array of notes/objects
    if (newNotes.length < notes.length) {
        saveNotes(newNotes);
        callback({
            message: "Note has been removed",
        });
    } else {
        callback({
            error: "No note found. Try a different title.",
        });
    }
}

const listNotes = (callback) => {
    const notes = loadNotes();
    callback(notes);
}

const readNote = (title, callback) => {
    const notes = loadNotes();
    const note = notes.find((note) => note.title === title);
    if (note) {
        callback({
            title: note.title,
            body: note.body,
        });
    } else {
        callback({
            error: "No note found. Try searching using a different title.",
        });
    }
}

//shared methods
const saveNotes = (notes) => {
    const dataJson = JSON.stringify(notes);
    fs.writeFileSync('notes.json', dataJson);
}
const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('notes.json');
        const dataJson = dataBuffer.toString();
        const notes = JSON.parse(dataJson);
        return notes;
    } catch (error) {
        return [];
    }
};

//export methods and variables
module.exports = {
    addNotes: addNotes,
    removeNotes: removeNotes,
    listNotes: listNotes,
    readNote: readNote
};