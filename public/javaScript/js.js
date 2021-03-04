//reference to the appropriate forms
const weatherForm = document.querySelector('.weather-form');
const addForm = document.querySelector('.add-note-form');
const queryForm = document.querySelector('.query-note-form');
const deleteForm = document.querySelector('.delete-note-form');
//get note tite input
const inputTitle = document.querySelector('.add-title');
//reference to field to display outputs
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

if (weatherForm) {
    const inputCityName = document.querySelector('.city-name');
    weatherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        messageOne.textContent = 'Loading...';
        messageTwo.textContent = '';
        const location = inputCityName.value;
        if (location.length == 0) {
            messageOne.textContent = "You must provide a city name!";
        } else {
            fetch('/weather?location=' + location).then((response) => {
                console.log(response);
                response.json().then((data) => {
                    if (data.error) {
                        messageOne.textContent = data.error;
                    } else {
                        messageOne.textContent = data.foundLocation;
                        messageTwo.textContent = data.desciption;
                    }
                });
            });
        }
    });
} else if (addForm) {
    const inputBody = document.querySelector('.add-body');
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        messageOne.textContent = 'Loading...';
        const title = inputTitle.value;
        const body = inputBody.value;
        if (title.length == 0 || body.length == 0) {
            messageOne.textContent = "You must provide valid inputs for both fields. Please fill in all inputs";
        } else {
            fetch('/notes/add?title=' + title + '&body=' + body).then((response) => {
                response.json().then((data) => {
                    if (data.error) {
                        messageOne.textContent = data.error;
                    } else {
                        messageOne.textContent = data.message;
                        inputTitle.value = '';
                        inputBody.value = '';
                    }
                });
            });
        }
    });
} else if (queryForm) {
    queryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        messageOne.textContent = 'Loading...';
        const title = inputTitle.value;
        if (title.length == 0) {
            messageOne.textContent = "You must provide a valid title for the note to query.";
        } else {
            fetch('/notes/query?query=' + title).then((response) => {
                response.json().then((data) => {
                    if (data.error) {
                        messageOne.textContent = data.error;
                    } else {
                        messageOne.textContent = 'Title: ' + data.title;
                        messageTwo.textContent = 'Description: ' + data.body;
                        inputTitle.value = '';
                    }
                });
            });
        }
    });
} else if (deleteForm) {
    deleteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        messageOne.textContent = 'Loading...';
        const title = inputTitle.value;
        if (title.length == 0) {
            messageOne.textContent = "You must provide a valid title for the note to delete.";
        } else {
            fetch('/notes/delete?delete=' + title).then((response) => {
                response.json().then((data) => {
                    if (data.error) {
                        messageOne.textContent = data.error;
                    } else {
                        messageOne.textContent = data.message;
                        inputTitle.value = '';
                    }
                });
            });
        }
    });
}