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
        raceFiller(races)
    })
})
//Races: This function will create our Menu Bar
function raceMenu(races){
    let dndRace = document.createElement('h1');
    dndRace.textContent = races.name;
    document.querySelector('#wizard-list').append(dndRace);
//This add event listener function will make the menu bar interactive. When the user clicks on a Race in the menu Bar it will present the race info from the raceDetails function
dndRace.addEventListener('click',()=>{
    raceDetails(races)
   });
};
//Iterates Race Data: .forEach that iterates through the data in each race object in the array "races"
function raceFiller(race){
    let url = race.url



    fetch(`https://www.dnd5eapi.co${url}`)
    .then(r=>r.json())
.then(raceData => {
    let subUrl
    if(raceData.name === "Elf" || raceData.name === "Gnome" || raceData.name === "Halfling" ){

        if(race.name === "Elf"){
            subUrl = "/api/subraces/high-elf"
        }else if(race.name === "Gnome"){
            subUrl = "/api/subraces/rock-gnome"
        }else if(race.name === "Halfling"){
            subUrl = "/api/subraces/lightfoot-halfling"
        }
        console.log(subUrl)
        fetch(`https://www.dnd5eapi.co${subUrl}`)
        .then(res=>res.json())
        .then(subrace=>{
            subrace.starting_proficiencies.forEach((prof)=>{
                raceData.starting_proficiencies.push(prof)
            })})}
    raceMenu(raceData)
}
)}


//Information: This function will present info on each race in the Menu Bar
function raceDetails(raceInQuestion){

    current = raceInQuestion
    const raceName = document.querySelector("#form-race")
    let primaryAbilityField = document.querySelector('#primary-ability');
    let secondaryAbilityField = document.querySelector("#secondary-ability")
    let languages = document.querySelector('#languages');
    languages.innerHTML = ""
    const optionalProfs = document.querySelector(`#optional-profs`)
    const selectableProfs = document.querySelector(`#selectable-profs`)
    selectableProfs.innerHTML=""
    const optionalAbility = document.querySelector(`#optional-ability`)
    const halfElfAbility = document.querySelector(`#half-elf-ability`)
    const primaryAbility = raceInQuestion.ability_bonuses[0].ability_score.index

    if(raceInQuestion.starting_proficiencies[0]){
    raceInQuestion.starting_proficiencies.forEach((proficiency)=>{
        const newChoice = document.createElement("tr")
        const defaultProf = document.createElement("td")
        const choiceSelect = document.createElement("td")

        defaultProf.innerHTML = `${proficiency.name}`

        choiceSelect.innerHTML = `
        <input type="text> value="" placeholder="Your Choice Here"></input>
        `
        newChoice.append(defaultProf)
        newChoice.append(choiceSelect)
        selectableProfs.append(newChoice)

        optionalProfs.hidden = false
    })} else {
        optionalProfs.hidden = true
    }

    if(raceInQuestion.ability_bonuses[1]){
        secondaryAbilityField.value = raceInQuestion.ability_bonuses[1].ability_score.index
        secondaryAbilityField.options[`${raceInQuestion.ability_bonuses[1].ability_score.index}`].innerText = raceInQuestion.ability_bonuses[1].ability_score.index.toUpperCase()
        optionalAbility.hidden = false
        halfElfAbility.hidden = true
    } else if(raceInQuestion.index === "half-elf"){
        halfElfAbility.hidden = false
        optionalAbility.hidden = false
    }else
    {
        optionalAbility.hidden = true
        halfElfAbility.hidden = true

    }

    raceInQuestion.languages.forEach((language)=>{
        const newRow = document.createElement("tr")
        const newLanguage = document.createElement("td")



        newLanguage.innerHTML = `
        <select id="default-${language.index}">
            <option value="abyssal">Abyssal</option>
            <option value="celestial">Celestial</option>
            <option value="common">Common</option>
            <option value="deep-speech">Deep Speech</option>
            <option value="draconic">Draconic</option>
            <option value="dwarvish">Dwarvish</option>
            <option value="elvish">Elvish</option>
            <option value="giant">Giant</option>
            <option value="gnomish">Gnomish</option>
            <option value="goblin">Goblin</option>
            <option value="halfling">Halfling</option>
            <option value="infernal">Infernal</option>
            <option value="orc">Orc</option>
            <option value="primordial">Primordial</option>
            <option value="sylvan">Sylvan</option>
            <option value="undercommon">Undercommon</option>
        </select>
        `
        newRow.append(newLanguage)
        languages.append(newRow)
        document.querySelector(`#default-${language.index}`).value=language.index

    })



    raceName.value = raceInQuestion.name

    primaryAbilityField.value = primaryAbility
    primaryAbilityField.options[`${primaryAbility}`].innerText = primaryAbility.toUpperCase()
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



