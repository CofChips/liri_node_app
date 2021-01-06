require("dotenv").config()
const keys = require("./keys.js")
//const spotify = new Spotify(keys.spotify)
const axios = require("axios")

const spotify = keys.spotify



if (process.argv[2] === "concert-this") {

    let artist = ""
    let artistFormat = ""

    for (let i = 3; i < process.argv.length; i++) {
        artist += process.argv[i]
        artistFormat += process.argv[i] + " "
    }

    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios.get(queryURL).then(function (res) {
        let names = res.data.map(function (item) {
            return {
                "venue": item.venue.name,
                "location": item.venue.location,
                "date": item.datetime
            }
        })
        if (names.length === 0) {
            console.log("No results found")
        }
        else { console.log("Results for: ", artistFormat, "\n", names) }
    })
}
else if (process.argv[2] === "movie-this") {
    let movie = ""

    for (let i = 3; i < process.argv.length; i++) {
        movie += process.argv[i] + "%20"
    }

    let queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy"

    axios.get(queryURL).then(function (res) {
        let rotten = ""
        if (res.data.Title != null) {
            for (let i = 0; i < res.data.Ratings.length; i++) {
                if (res.data.Ratings[i].Source === "Rotten Tomatoes") {
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

else if (process.argv[2] === "spotify-this-song") {
    let token = "";
    let song = "";

    for (let i = 3; i < process.argv.length; i++) {
        song += process.argv[i] + "%20"
    }

    if(!process.argv[3]){
        console.log("Please enter a song")
    } else{

        axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            params: { grant_type: 'client_credentials' },
            headers: {
                // 'Authorization' : `Basic ${spotify.id}:${spotify.secret}`
            },
            auth: {
                username: spotify.id,
                password: spotify.secret
            }
    
        }).then(function (res) {
            token = res.data.access_token
            axios({
                method: 'get',
                url: 'https://api.spotify.com/v1/search?q='+song+'&type=track&offset=0&limit=1',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(function (res) {
                let results = res.data.tracks.items[0]
                let artists = "";
                for(let i = 0; i < results.artists.length; i++){
                    artists+= results.artists[i].name + " "
                }
                console.log(`
                Artist(s): ${artists}
                Track Name: ${results.name}
                Preview: ${results.preview_url}
                Album: ${results.album.name}
                `)
            })
        }).catch(function (error) {
            console.log(error)
        });
    }



}
else {

    console.log("something")
}




