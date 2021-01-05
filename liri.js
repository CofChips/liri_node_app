require("dotenv").config()
const keys = require("./keys.js")
//const spotify = new Spotify(keys.spotify)
const axios = require("axios")

const spotify = keys.spotify

let artist = ""

if (process.argv[2] === "concert-this"){
    for(let i = 3; i < process.argv.length; i++){
        artist += process.argv[i]
    }

    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios.get(queryURL).then(function(res){
        let names = res.data.map(function(item){
            return {
                "venue" : item.venue.name,
                "location" : item.venue.location,
                "date" : item.datetime
            }
        })
        if(names.length === 0){
            console.log("No results found")
        }
        else{console.log("Results for: ",artist,"\n", names)}
    })
} else{

    console.log("something")
}




//console.log(spotify)


