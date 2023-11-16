document.addEventListener('DOMContentLoaded', () => {
//This is our Get Request from the API
fetch("https://www.dnd5eapi.co/api/races")
.then(r=>r.json())
.then(data => {
    console.log(data)
//Iterates Only Race Names: .forEach function to allow objects fetched from API to be iterable
    data.results.forEach(races =>{
        raceFiller(races.url)
    })
})
//Races: This function will create our Menu Bar
function raceMenu(races){
    let dndRace = document.createElement('h1');
    dndRace.textContent = races.name;
    document.querySelector('#wizard-list').append(dndRace);
//This add event listener function will make the menu bar interactive. When the user clicks on a Race in the menu Bar it will present the race info from the raceDetails function
dndRace.addEventListener('click',()=>{
    raceDetails(races);
   });
};
//Iterates Race Data: .forEach that iterates through the data in each race object in the array "races"
function raceFiller(url){
    fetch(`https://www.dnd5eapi.co${url}`)
    .then(r=>r.json())
.then(data => {
    raceMenu(data)
}
)}
//Information: This function will present info on each race in the Menu Bar
function raceDetails(raceInQuestion){
    let allProficiencies = ""
    raceInQuestion.starting_proficiencies.forEach((proficiency)=>{
        allProficiencies = allProficiencies + " " + proficiency.index
        //console.log(proficiency)
    })
    let allLanguages = ""
    raceInQuestion.languages.forEach((language)=>{
        allLanguages = allLanguages + " " + language.index
        //console.log(language)
    })

    let abilityScore = document.querySelector('#primary-ability');
    let proficiencies = document.querySelector('#proficiencies');
    let languages = document.querySelector('#languages');

    console.log(raceInQuestion)

    const abilityScoreInput = raceInQuestion.ability_bonuses[0].ability_score.index
    abilityScore.value = abilityScoreInput
    abilityScore.options[`${abilityScoreInput}`].innerText = abilityScoreInput
    proficiencies.value = allProficiencies
    languages.value = allLanguages

}
//New Attribute Origins Form Function:
let newOrigin = document.querySelector('#variant-form');
newOrigin.addEventListener('submit',(e)=>{
    e.preventDefault();
let newObject = {
    ability_bonuses: e.target["#primary-ability"].value,
    starting_proficiencies: e.target["#proficiencies"].value,
    languages: e.target["#languages"].value
};
raceDetails(newObject);
})

})
=======
//code goes here
const variantForm = document.getElementById("variant-form")
variantForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    addOrigin(e)
})

let current


function initialize(){
    fetch("http://localhost:3000/races/")
    .then(r=>r.json())
    .then((data)=>{
        console.log(data)
    })


}

function addOrigin(newOrigin){

    const postObj = {
        index: `${newOrigin.target[0].value}`,
        ability_bonuses : [
            {
                ability_score: {
                    index: `${newOrigin.target[1].value}`,
                    name: `${newOrigin.target[1].value.slice(0,3).toUpperCase()}`,
                },
                bonus : 2
            },
            {
                ability_score: {
                    index: `${newOrigin.target[2].value}`,
                    name: `${newOrigin.target[2].value.slice(0,3).toUpperCase()}`,
                },
                bonus : 1
            },
            {
                ability_score: {
                    index: `${newOrigin.target[3].value}`,
                    name: `${newOrigin.target[3].value.slice(0,3).toUpperCase()}`,
                },
                bonus : -1
            }
        ],
        languages: [
            {
                index: `${newOrigin.target[4].value}`,
                name:  `${newOrigin.target[4].value.charAt(0).toUpperCase()}` + `${newOrigin.target[4].value.slice(1)}`,

            }
        ],
        starting_proficiencies: [
            {
                index: `${newOrigin.target[5].value}`,
                name: `${newOrigin.target[5].value.charAt(0).toUpperCase()}` + `${newOrigin.target[5].value.slice(1)}`
            }

        ]
    }

    // const putObj = {
    //     index : "Kobold",
    //     ability_bonuses : [
    //         {
    //         ability_score: {
    //             index: "dex",
    //             name: "DEX",
    //             url: "api/ability-scores/con"

    //         },
    //         bonus : 2
    //          }
    //     ],
    //     starting_proficiencies:[
    //         {index: "biters",
    //         name: "biters",
    //         url: "/api/proficiencies/unarmed"}
    //     ],
    //     languages : [
    //         {
    //             index: "common",
    //             name : "Common",
    //             url : "api/languages/common"
    //         },
    //         {
    //             index: "draconic",
    //             name: "Draconic",
    //             url : "api/languages/draconic"
    //         }
    //     ]
        
    // }

    fetch("http://localhost:3000/races/", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(postObj)
    }).then(()=>{
        showConfirmation("Custom Origin Added!", "green")
    }).catch((err)=>{
        showConfirmation(err, "red")
    })
}

function showConfirmation(message, color){
    const confirmation = document.getElementById("button-feedback")
    confirmation.textContent = `${message}`
    confirmation.style = `background-color : ${color}`
    confirmation.hidden = false
    setTimeout(()=>{
        confirmation.hidden = true
    }, 3500)
}

initialize()

