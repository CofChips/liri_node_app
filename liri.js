require("dotenv").config()
const keys = require("./keys.js")
//const spotify = new Spotify(keys.spotify)
const axios = require("axios")

const spotify = keys.spotify

let artist = ""
let artistFormat = ""

if (process.argv[2] === "concert-this"){
    for(let i = 3; i < process.argv.length; i++){
        artist += process.argv[i]
        artistFormat += process.argv[i] + " "
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
        else{console.log("Results for: ",artistFormat,"\n", names)}
    })
} 
else if(process.argv[2] === "movie-this"){
    let movie=""

    for(let i = 3; i < process.argv.length; i++){
        movie += process.argv[i] + "%20"
    }

    let queryURL ="https://www.omdbapi.com/?t="+movie+"&apikey=trilogy"

    axios.get(queryURL).then(function(res){
        let rotten = ""
        if(res.data.Title != null){
            for (let i = 0; i < res.data.Ratings.length; i++){
                if(res.data.Ratings[i].Source === "Rotten Tomatoes"){
                    rotten = res.data.Ratings[i].Value
                }
            }
        }
        console.log(`
        Title: ${res.data.Title}
        Year: ${res.data.Year}
        IMDB Rating: ${res.data.imdbRating}
        Rotten Tomatoes Rating: ${rotten}
        Country: ${res.data.Country}
        Language: ${res.data.Lanuage}
        Plot: ${res.data.Plot}
        Actors: ${res.data.Actors}
        `)
    })
}
else{

    console.log("something")
}




