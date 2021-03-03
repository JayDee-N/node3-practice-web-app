const searchForm = document.querySelector('.weather-form');
const input = document.querySelector('.city-name');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = input.value;
    messageOne.textContent = 'Loading...';
    messageTwo.textContent = '';
    if (location.length == 0) {
        messageOne.textContent = "You must provide a city name!";
    } else {
        fetch('http://localhost:3000/weather?location=' + location).then((response) => {
            console.log(response);
            response.json().then((data) => {
                if (data.error) {
                    messageOne.textContent = data.error;
                } else {
                    messageOne.textContent = data.foundLocation;
                    messageTwo.textContent = data.desciption;
                    console.log(data);
                }
            });
        });
    }
});