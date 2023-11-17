document.addEventListener('DOMContentLoaded', () => {

    let defaultRace
    let current
    let totalLangs = 0
    let totalProfs = 0

    //calls the function which populates the custom user origins
    customMenu()

    const deleteButton = document.querySelector("#delete-button")
    deleteButton.addEventListener("click", (e)=>{
        removeCustomOrigin(current)
    })



    //This is our Get Request from the API
    fetch("https://www.dnd5eapi.co/api/races")
        .then(r => r.json())
        .then(data => {
            //Iterates Only Race Names: .forEach function to allow objects fetched from API to be iterable
            data.results.forEach(races => {
                raceFiller(races)
            })
        })
    //Races: This function will create our Menu Bar
    function raceMenu(races) {
        let dndRace = document.createElement('h1');
        dndRace.textContent = races.name;
        document.querySelector('#wizard-list').append(dndRace);
        //This add event listener function will make the menu bar interactive. When the user clicks on a Race in the menu Bar it will present the race info from the raceDetails function
        dndRace.addEventListener('click', () => {
            raceDetails(races)
        });
        defaultRace = races
        raceDetails(races)
    };
    //Iterates Race Data: .forEach that iterates through the data in each race object in the array "races"
    //uses the route contained in the "race" object to get the relevant data from the api
    function raceFiller(race) {
        let url = race.url



        fetch(`https://www.dnd5eapi.co${url}`)
            .then(r => r.json())
            .then(raceData => {
                let subUrl
                //These 3 races have special rules and need a supplemental api call
                if (raceData.name === "Elf" || raceData.name === "Gnome" || raceData.name === "Halfling") {

                    if (race.name === "Elf") {
                        subUrl = "/api/subraces/high-elf"
                    } else if (race.name === "Gnome") {
                        subUrl = "/api/subraces/rock-gnome"
                    } else if (race.name === "Halfling") {
                        subUrl = "/api/subraces/lightfoot-halfling"
                    }
                    fetch(`https://www.dnd5eapi.co${subUrl}`)
                        .then(res => res.json())
                        .then(subrace => {
                            subrace.starting_proficiencies.forEach((prof) => {
                                raceData.starting_proficiencies.push(prof)
                            })
                        })
                }
                raceMenu(raceData)

            }
            )


    }


    //Information: This function will present info on each race in the Menu Bar
    function raceDetails(raceInQuestion) {
        current = raceInQuestion
        const raceName = document.querySelector("#form-race")
        let primaryAbilityField = document.querySelector('#primary-ability');
        let secondaryAbilityField = document.querySelector("#secondary-ability")
        let languages = document.querySelector('#languages');
        languages.innerHTML = ""
        const optionalProfs = document.querySelector(`#optional-profs`)
        const selectableProfs = document.querySelector(`#selectable-profs`)
        selectableProfs.innerHTML = ""
        const optionalAbility = document.querySelector(`#optional-ability`)
        const halfElfAbility = document.querySelector(`#half-elf-ability`)
        const primaryAbility = raceInQuestion.ability_bonuses[0].ability_score.index
        totalProfs = 0
        //confirms that racial proficiencies exist before populating that section of the form
        if (raceInQuestion.starting_proficiencies[0]) {
            raceInQuestion.starting_proficiencies.forEach((proficiency) => {
                const newChoice = document.createElement("tr")
                const defaultProf = document.createElement("td")
                const choiceSelect = document.createElement("td")

                defaultProf.innerHTML = `${proficiency.name}`

                choiceSelect.innerHTML = `
        <input id="prof-${totalProfs}" type="text value="" placeholder="Your Choice Here"></input>
        `
                totalProfs++
                newChoice.append(defaultProf)
                newChoice.append(choiceSelect)
                selectableProfs.append(newChoice)

                optionalProfs.hidden = false
            })
        } else {
            optionalProfs.hidden = true
        }

        //confirms that the race has a secondary (or teritiary) ability bonus before populating the form with it
        if (raceInQuestion.ability_bonuses[1]) {
            secondaryAbilityField.value = raceInQuestion.ability_bonuses[1].ability_score.index
            secondaryAbilityField.options[`${raceInQuestion.ability_bonuses[1].ability_score.index}`].innerText = raceInQuestion.ability_bonuses[1].ability_score.index.toUpperCase()
            optionalAbility.hidden = false
            halfElfAbility.hidden = true
        } else if (raceInQuestion.index === "half-elf") {
            halfElfAbility.hidden = false
            optionalAbility.hidden = false
        } else {
            optionalAbility.hidden = true
            halfElfAbility.hidden = true

        }

        // all races have languages by default, so this will generate a section on the form
        // to customize the language, setting the initial values to the racial defaults
        totalLangs = 0
        raceInQuestion.languages.forEach((language) => {
            const newRow = document.createElement("tr")
            const newLanguage = document.createElement("td")
            


            newLanguage.innerHTML = `
        <select name="language-${totalLangs}" class="language-${totalLangs}">
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
            document.querySelector(`.language-${totalLangs}`).value = language.index
            totalLangs++
        })



        raceName.value = raceInQuestion.name

        primaryAbilityField.value = primaryAbility
        primaryAbilityField.options[`${primaryAbility}`].innerText = primaryAbility.toUpperCase()
    }



//Accepts the form inputs and adds a new race to the db
function addOrigin(newOrigin) {

   const langConverted = []
   const profConverted = []
    //try - catch syntax is used to make the confirmation function have a response on a failed db write
    try {

        for(let i = 0; i < totalLangs; i++){
            const thisLang = newOrigin.target[`language-${i}`].value
            const langObj = {
                index : `${thisLang}`,
                name: `${thisLang.charAt(0).toUpperCase()}` + `${thisLang.slice(1)}`
            }
            langConverted.push(langObj)
        }

        for(let i = 0; i < totalProfs; i++){
            const thisProf = newOrigin.target[`prof-${i}`].value
            const profObj = {
                index: `${thisProf}`,
                name: `${thisProf.charAt(0).toUpperCase()}` + `${thisProf.slice(1)}`
            }
            profConverted.push(profObj)
            console.log(profObj)
        }
        

        const postObj = {
            index: `${newOrigin.target["form-race"].value.toLowerCase()}`,
            name: `${newOrigin.target["form-race"].value}`,
            ability_bonuses: [
                {
                    ability_score: {
                        index: `${newOrigin.target["primary-ability"].value}`,
                        name: `${newOrigin.target["primary-ability"].value.slice(0, 3).toUpperCase()}`,
                    },
                    bonus: 2
                },
                {
                    ability_score: {
                        index: `${newOrigin.target["secondary-ability"].value}`,
                        name: `${newOrigin.target["secondary-ability"].value.slice(0, 3).toUpperCase()}`,
                    },
                    bonus: 1
                }
            ],
            languages:  langConverted
            ,
            starting_proficiencies: profConverted
        }

            //adds custom origin to db and shows on-screen feedback on success or failure
    fetch("http://localhost:3000/races/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postObj)
    }).then(() => {
        showConfirmation("Custom Origin Added!", "green")
        raceDetails(postObj)
        customMenu()
    }).catch((err) => {
        showConfirmation(err, "red")
    })

    }
    catch (err) {
        showConfirmation(err, "red")
    }



}

//fetches and renders a list of user-created custom origins from the database
function customMenu() {

    const customList = document.querySelector('#saved-origins-list')
    customList.innerHTML = ""

    fetch("http://localhost:3000/races")
        .then(r => r.json())
        .then(data => {

            data.forEach(race => {
                const newUserOrigin = document.createElement('h1');
                newUserOrigin.textContent = race.name;
                document.querySelector('#saved-origins-list').append(newUserOrigin);

                newUserOrigin.addEventListener('click', () => {
                    raceDetails(race)
                })
            })
            current = data[data.length-1]
        })

}

//shows feedback to user before disappearing after 3.5 seconds
function showConfirmation(message, color) {
    const confirmation = document.getElementById("button-feedback")
    confirmation.textContent = `${message}`
    confirmation.style = `background-color : ${color}`
    confirmation.hidden = false
    setTimeout(() => {
        confirmation.hidden = true
    }, 3500)
}

function removeCustomOrigin(current){

    fetch(`http://localhost:3000/races/${current.id}`, {
        method: "DELETE"
    })
    .then(res=>{
        if(res.ok){
            showConfirmation("Custom Origin Deleted", "green")
        } else{
            showConfirmation("No matching Custom Origin found", "red")
        }
    })
    .then(()=>{
        customMenu()
        raceDetails(defaultRace)

    })
}


})
