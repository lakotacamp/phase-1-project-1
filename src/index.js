document.addEventListener('DOMContentLoaded', () => {

const variantForm = document.getElementById("variant-form")
variantForm.addEventListener("submit", (e)=>{
        e.preventDefault()
        addOrigin(e)
        let newObject = {
            ability_bonuses: e.target["#primary-ability"].value,
            starting_proficiencies: e.target["#proficiencies"].value,
            languages: e.target["#languages"].value
        };
        raceDetails(newObject);
})

let current

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
    current = raceInQuestion
    console.log(current)
    const raceName = document.querySelector("#form-race")
    let primaryAbilityField = document.querySelector('#primary-ability');
    let secondaryAbilityField = document.querySelector("#secondary-ability")
    let proficiencies = document.querySelector('#proficiencies');
    let languages = document.querySelector('#languages');
    const optionalProfs = document.querySelector(`#optional-profs`)
    const optionalAbility = document.querySelector(`#optional-ability`)
    let allProficiencies = ""
    const primaryAbility = raceInQuestion.ability_bonuses[0].ability_score.index
    // const secondaryAbility = raceInQuestion.ability_bonuses[1].ability_score.index

    if(raceInQuestion.starting_proficiencies[0]){
    raceInQuestion.starting_proficiencies.forEach((proficiency)=>{
        allProficiencies = allProficiencies + " " + proficiency.index
        proficiencies.value = allProficiencies
        console.log(proficiency)
        optionalProfs.hidden = false
    })} else {
        optionalProfs.hidden = true
    }

    if(raceInQuestion.ability_bonuses[1]){
        secondaryAbilityField.value = raceInQuestion.ability_bonuses[1].ability_score.index
        secondaryAbilityField.options[`${raceInQuestion.ability_bonuses[1].ability_score.index}`].innerText = raceInQuestion.ability_bonuses[1].ability_score.index.toUpperCase()
        optionalAbility.hidden = false
    } else {
        optionalAbility.hidden = true
    }

    let allLanguages = ""
    raceInQuestion.languages.forEach((language)=>{
        allLanguages = allLanguages + " " + language.index
        //console.log(language)
    })



    raceName.value = raceInQuestion.name

    primaryAbilityField.value = primaryAbility
    primaryAbilityField.options[`${primaryAbility}`].innerText = primaryAbility.toUpperCase()
    languages.value = allLanguages

}
})




function addOrigin(newOrigin){

    console.log(newOrigin)
    const postObj = {
        index: `${newOrigin.target["form-race"].value}`,
        ability_bonuses : [
            {
                ability_score: {
                    index: `${newOrigin.target["primary-ability"].value}`,
                    name: `${newOrigin.target["primary-ability"].value.slice(0,3).toUpperCase()}`,
                },
                bonus : 2
            },
            {
                ability_score: {
                    index: `${newOrigin.target["secondary-ability"].value}`,
                    name: `${newOrigin.target["secondary-ability"].value.slice(0,3).toUpperCase()}`,
                },
                bonus : 1
            }
        ],
        languages: [
            {
                index: `${newOrigin.target["languages"].value}`,
                name:  `${newOrigin.target["languages"].value}`,

            }
        ],
        starting_proficiencies: [
            {
                index: `${newOrigin.target["proficiencies"].value}`,
                name: `${newOrigin.target["proficiencies"].value}`
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



