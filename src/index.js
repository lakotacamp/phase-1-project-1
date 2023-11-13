document.addEventListener('DOMContentLoaded', () => {
//This is our Get Request from the API
fetch("https://www.dnd5eapi.co/api/races")
.then(r=>r.json())
.then(data => {
    console.log(data)
//.forEach function to allow objects fetched from API to be iterable
    data.forEach((races) =>{
        raceMenu(races)
    })
});

//Races: This function will create our Menu Bar
function raceMenu(races){
    let dndRace = document.createElement('h1');
    dndRace.textContent = races.name;
    document.querySelector('index.html location to append to').append(dndRace);
//This add event listener function will make the menu bar interactive. When the user clicks on a Race in the menu Bar it will present the race info from the 
};

//Information: This function will present info on each race in the Menu Bar
// function itemDetails(x){
//     let itemDetail = document.querySelector('index.html location to append to');

//     itemDetail.value(corresponding html element eg. textContent/innerText/src) = x.key(corresponding json object key);
// }
})