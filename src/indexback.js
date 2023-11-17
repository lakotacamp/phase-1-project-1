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

function raceBook(race){
   const bookLangs = document.querySelector("#book-langs")
   const bookProfs = document.querySelector("#book-profs")
   const bookName = document.querySelector("#book-name")
   const bookAbilities = document.querySelector("book-abilities")
   let profsString = ""
   let langString = ""
   let abilityString = ""
   bookName.textContent = `${race.name}`

   race.starting_proficiencies.forEach((prof)=>{
        profsString = profsString + " " + `${prof.name}`
   })

   bookProfs.textContent = profsString

   race.languages.forEach((language)=>{
    langString = langString + " " + `${language.name}`
   })

   bookLangs.textContent = langString

   race.ability_bonuses.forEach((abi)=>{
    abilityString = abilityString + " " + `${abi.ability_score.name} ` + `+${abi.bonus}` 
   })
   
   bookAbilities.textContent = abilityString

}