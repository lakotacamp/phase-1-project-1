document.addEventListener('DOMContentLoaded', () => {
//This is our Get Request from the API
fetch("https://www.dnd5eapi.co/api/races/dwarf")
.then(r=>r.json())
.then(data => {
    console.log(data)
//Iterates Only Race Names: .forEach function to allow objects fetched from API to be iterable
    data.results.forEach(races =>{
        raceMenu(races)
    })
})

//Races: This function will create our Menu Bar
function raceMenu(races){
    let dndRace = document.createElement('h1');
    dndRace.textContent = races.name;
    document.querySelector('#wizard-list').append(dndRace);
//This add event listener function will make the menu bar interactive. When the user clicks on a Race in the menu Bar it will present the race info from the 
};
//Iterates Race Data: .forEach that iterates through the data in each race object in the array "races"
// data.forEach((races)=>{
//     raceFiller(races.index)
// })
// function raceFiller(raceInQuestion){
//     fetch(`https://www.dnd5eapi.co/api/races/${raceInQuestion}`)
//     console.log(raceInQuestion)
// }
//Information: This function will present info on each race in the Menu Bar
// function raceDetails(races){
//     let abilityScore = document.querySelector('#primary-ability');
//     let proficiencies = document.querySelector('#proficiencies');
//     let languages = document.querySelector('#languages');

//     abilityScore.textContent = racecInQuestion.
//     proficiencies.textContent =
//     languages.textContent = 
// }
})