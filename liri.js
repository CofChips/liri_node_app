require("dotenv").config()
const keys = require("./keys.js")

const axios = require("axios")
const fs = require("fs")

const spotify = keys.spotify

switch (process.argv[2]) {
    case "concert-this":
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

        break;

    case "movie-this":
        let movie = ""

        for (let i = 3; i < process.argv.length; i++) {
            movie += process.argv[i] + "%20"
        }

        let queryURL1 = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy"

        axios.get(queryURL1).then(function (res) {
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

        break;

    case "spotify-this-song":
        let token = "";
        let song = "";

        for (let i = 3; i < process.argv.length; i++) {
            song += process.argv[i] + "%20"
        }

        if (!process.argv[3]) {
            song = "the%20sign"
        }

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
                url: 'https://api.spotify.com/v1/search?q=' + song + '&type=track&offset=0&limit=1',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(function (res) {
                let results = res.data.tracks.items[0]
                let artists = "";
                for (let i = 0; i < results.artists.length; i++) {
                    artists += results.artists[i].name + " "
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

        break;

    case "do-what-it-says":
        let entry;

        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }

            entry = data.split(",")

            switch (entry[0]) {
                case "concert-this":
                    let artist = entry[1].replace(/\r\n|"| /g, "")
                    let artistFormat = entry[1].replace(/\r\n|"/g, "")
                    console.log(artistFormat)

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
                    break;

                case "movie-this":
                    let moviePre = entry[1].replace(/\r\n|"/g, "")
                    let movie = moviePre.replace(/ /g, "%20")

                    let queryURL1 = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy"

                    axios.get(queryURL1).then(function (res) {
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
                    break;

                case "spotify-this-song":
                    let token = "";
                    let song = entry[1].replace(/\r\n|"/g, "");
                    let songForm = song.replace(/ /g, "%20")



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
                            url: 'https://api.spotify.com/v1/search?q=' + songForm + '&type=track&offset=0&limit=1',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }).then(function (res) {
                            let results = res.data.tracks.items[0]
                            let artists = "";
                            for (let i = 0; i < results.artists.length; i++) {
                                artists += results.artists[i].name + " "
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
                    break;
            }
        })
    
        break;
    default:
        console.log("Please enter a valid command")
        break;

}


// if (process.argv[2] === "concert-this") {

//     let artist = ""
//     let artistFormat = ""

//     for (let i = 3; i < process.argv.length; i++) {
//         artist += process.argv[i]
//         artistFormat += process.argv[i] + " "
//     }

//     let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

//     axios.get(queryURL).then(function (res) {
//         let names = res.data.map(function (item) {
//             return {
//                 "venue": item.venue.name,
//                 "location": item.venue.location,
//                 "date": item.datetime
//             }
//         })
//         if (names.length === 0) {
//             console.log("No results found")
//         }
//         else { console.log("Results for: ", artistFormat, "\n", names) }
//     })
// }
// else if (process.argv[2] === "movie-this") {
//     let movie = ""

//     for (let i = 3; i < process.argv.length; i++) {
//         movie += process.argv[i] + "%20"
//     }

//     let queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy"

//     axios.get(queryURL).then(function (res) {
//         let rotten = ""
//         if (res.data.Title != null) {
//             for (let i = 0; i < res.data.Ratings.length; i++) {
//                 if (res.data.Ratings[i].Source === "Rotten Tomatoes") {
//                     rotten = res.data.Ratings[i].Value
//                 }
//             }
//         }
//         console.log(`
//         Title: ${res.data.Title}
//         Year: ${res.data.Year}
//         IMDB Rating: ${res.data.imdbRating}
//         Rotten Tomatoes Rating: ${rotten}
//         Country: ${res.data.Country}
//         Language: ${res.data.Lanuage}
//         Plot: ${res.data.Plot}
//         Actors: ${res.data.Actors}
//         `)
//     })
// }

// else if (process.argv[2] === "spotify-this-song") {
//     let token = "";
//     let song = "";

//     for (let i = 3; i < process.argv.length; i++) {
//         song += process.argv[i] + "%20"
//     }

//     if (!process.argv[3]) {
//         song = "the%20sign"
//     }

//     axios({
//         method: 'post',
//         url: 'https://accounts.spotify.com/api/token',
//         params: { grant_type: 'client_credentials' },
//         headers: {
//             // 'Authorization' : `Basic ${spotify.id}:${spotify.secret}`
//         },
//         auth: {
//             username: spotify.id,
//             password: spotify.secret
//         }

//     }).then(function (res) {
//         token = res.data.access_token
//         axios({
//             method: 'get',
//             url: 'https://api.spotify.com/v1/search?q=' + song + '&type=track&offset=0&limit=1',
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         }).then(function (res) {
//             let results = res.data.tracks.items[0]
//             let artists = "";
//             for (let i = 0; i < results.artists.length; i++) {
//                 artists += results.artists[i].name + " "
//             }
//             console.log(`
//                 Artist(s): ${artists}
//                 Track Name: ${results.name}
//                 Preview: ${results.preview_url}
//                 Album: ${results.album.name}
//                 `)
//         })
//     }).catch(function (error) {
//         console.log(error)
//     });
// }

// else if (process.argv[2] === "do-what-it-says") {
//     let entry;

//     fs.readFile("random.txt", "utf8", function (error, data) {
//         if (error) {
//             return console.log(error);
//         }

//         entry = data.split(",")

//         if (entry[0] === "spotify-this-song") {
//             let token = "";
//             let song = entry[1].replace(/\r\n|"/g, "");
//             let songForm = song.replace(/ /g, "%20")



//             axios({
//                 method: 'post',
//                 url: 'https://accounts.spotify.com/api/token',
//                 params: { grant_type: 'client_credentials' },
//                 headers: {
//                     // 'Authorization' : `Basic ${spotify.id}:${spotify.secret}`
//                 },
//                 auth: {
//                     username: spotify.id,
//                     password: spotify.secret
//                 }

//             }).then(function (res) {
//                 token = res.data.access_token
//                 axios({
//                     method: 'get',
//                     url: 'https://api.spotify.com/v1/search?q=' + songForm + '&type=track&offset=0&limit=1',
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 }).then(function (res) {
//                     let results = res.data.tracks.items[0]
//                     let artists = "";
//                     for (let i = 0; i < results.artists.length; i++) {
//                         artists += results.artists[i].name + " "
//                     }
//                     console.log(`
//                         Artist(s): ${artists}
//                         Track Name: ${results.name}
//                         Preview: ${results.preview_url}
//                         Album: ${results.album.name}
//                         `)
//                 })
//             }).catch(function (error) {
//                 console.log(error)
//             });
//         }
//     })
// }
// else {

//     console.log("Please enter a valid instruction")
// }




