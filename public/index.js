console.log("From Public Folder")

const playlistForm = document.querySelector('form')
const input = document.querySelector('input')
const messageOne = document.querySelector('#messageOne');
const messageTwo = document.querySelector('#messageTwo');


playlistForm.addEventListener('submit', e => {
    e.preventDefault();
    const playlistId = input.value;

    fetch(`/duration/?playlistId=${playlistId}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                messageOne.textContent = ""
                messageTwo.textContent = data.error;
                input.value = '';
            } else {
                messageOne.textContent = ""
                messageTwo.textContent = "";
                let time = timeFromSec(parseInt(data.totalDurationinSec))
                messageOne.innerHTML = `Total Duration Of Playlist= ${time}`
                input.value = '';
            }
        })
        .catch(err => {
            messageTwo.textContent = err.message;
        })

})

function timeFromSec(sec) {
    let hours = Math.floor(sec / 3600);
    let min = Math.floor((sec % 3600) / 60);
    let seconds = sec % 60;
    return `${hours} Hours, ${min} Minutes, ${seconds} Seconds`
}