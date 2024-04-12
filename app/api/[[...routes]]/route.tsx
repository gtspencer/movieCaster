/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { pinata } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  hub: pinata()
})

app.frame('/', (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(to right, #432889, #17101F)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 50,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        > 🎥 What movie should I watch today? 🍿
        </div>
      </div>
    ),
    intents: [
        <Button>Help me decide</Button>,
    ],
    action: '/mood'
  })
})

app.frame('/mood', async (c) => {
  const { verified, frameData } = c

  if (!verified) {
    return ReturnUnverified(c, "Please login to Farcaster")
  }

  const senderFid = frameData?.fid

  if (!senderFid) {
    return ReturnUnverified(c, "Please login to farcaster")
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:'linear-gradient(to right, #432889, #17101F)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          How are you feeling? 🤔
        </div>
      </div>
    ),
    intents: [
      <Button value="sad">Sad 😞</Button>,
      <Button value="neutral">Neutral 😐</Button>,
      <Button value="happy">Happy 😄</Button>,
    ],
    action: '/genre'
  })
})

app.frame('/genre', async (c) => {
  const { verified, frameData, buttonValue } = c

  if (!verified) {
    return ReturnUnverified(c, "Please login to Farcaster")
  }

  const senderFid = frameData?.fid

  if (!senderFid) {
    return ReturnUnverified(c, "Please login to farcaster")
  }

  const mood = buttonValue ? buttonValue : "neutral"

  let genre1 = "Action"
  let genre2 = "Documentary"
  let genre3 = "Science Fiction"
  let genre4 = "Fantasy"

  let message = "Let's try to get you to happy!  What genre would you like?"

  switch (mood) {
    case "sad":
      message = "🥺 Sorry to hear that!  What genre would you like to wallow in?"
      genre1 = "Drama"
      genre2 = "Horror"
      genre3 = "Mystery"
      genre4 = "Thriller"
      break;
    case "happy":
      message = "😁 Me too!  Let's keep that mood going with some genres.  Which would you like to see?"
      genre1 = "Adventure"
      genre2 = "Comedy"
      genre3 = "Animation"
      genre4 = "Romance"
      break;
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:'linear-gradient(to right, #432889, #17101F)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {`${message}`}
        </div>
      </div>
    ),
    intents: [
      <Button value={genre1}>{genre1}</Button>,
      <Button value={genre2}>{genre2}</Button>,
      <Button value={genre3}>{genre3}</Button>,
      <Button value={genre4}>{genre4}</Button>,
    ],
    action: '/year'
  })
})

app.frame('/year', async (c) => {
  const { buttonValue } = c

  var url = `/region/${buttonValue}`
  console.log(url)

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:'linear-gradient(to right, #432889, #17101F)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Great!  Should we search through a specific year? 📆
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Ex: 2020"/>,
      <Button value="custom">Custom Year</Button>,
      <Button value="any">Any</Button>,
    ],
    action: url
  })
})

app.frame('/region/:genre', async (c) => {
  const { buttonValue, inputText } = c

  const genre = c.req.param('genre')

  let year = "any"
  if (buttonValue == "custom") {
    if (inputText) {
      console.log("custom year " + inputText)
      var regex = /^\d{4}$/;
      if (regex.test(inputText)) {
        console.log('found match')
        year = inputText
      }
    }
  }

  var url = `/last/${genre}/${year}`

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:'linear-gradient(to right, #432889, #17101F)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          What region should the movie be from?
        </div>
      </div>
    ),
    intents: [
      <Button value="US">USA</Button>,
      <Button value="FR">France</Button>,
      <Button value="IT">Italy</Button>,
      <Button value="JP">Japan</Button>,
    ],
    action: url
  })
})

app.frame('/last/:genre/:year/:region?', async (c) => {
  const { buttonValue, frameData } = c

  let { genre, year, region } = c.req.param()

  let regionButtonVal = buttonValue
  if (regionButtonVal != "refresh" && buttonValue) {
    region = buttonValue
  }
  if (!region) {
    region = "US"
  }

  if (!genre) {
    genre = "Action"
  }

  if (!year) {
    year = "2024"
  }

  console.log(`fid: ${frameData?.fid} searching for genre ${genre} and year ${year} and region ${region}`)
  const movie = await GetMovie(genre, year, region)

  if (!movie) {
    return ReturnUnverified(c, "No movies found, please try again")
  }
  let movieId = movie.id
  console.log(`fid: ${frameData?.fid} got movie ${movie.title}`)

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:'linear-gradient(to right, #432889, #17101F)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 20,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 5,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {`Genre: ${genre} | Year: ${year} | Region: ${region}`}
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 40,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 5,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {`${movie.title}`}
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 20,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 0,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {`Rated ${movie.vote_average}/10`}
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 25,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1,
            marginTop: 5,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {`${movie.overview}`}
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 25,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1,
            marginTop: 5,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {``}
        </div>
        <br/>
        <img src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`} style={{
            maxWidth: '200', /* Set maximum width */
            maxHeight: '300px', /* Set maximum height */
            alignSelf: 'center', /* Align image to center horizontally */
        }}></img>
      </div>
    ),
    intents: [
      <Button value='refresh' action={`/last/${genre}/${year}/${region}`}>Next Movie</Button>,
      <Button.Link href={`https://www.themoviedb.org/movie/${movieId}`}>View Movie</Button.Link>,
      <Button action='/'>Start over!</Button>,
    ],
    imageAspectRatio: "1.91:1"
  })
})

const genresToIds : {[id: string] : string} = {
  "Adventure" : "12",
  "Comedy" : "35",
  "Animation" : "16",
  "Romance" : "10749",
  "Action" : "28",
  "Documentary" : "99",
  "Science Fiction" : "878",
  "Fantasy" : "14",
  "Drama" : "18",
  "Horror" : "27",
  "Mystery" : "9648",
  "Thriller" : "53",
}

const idsToCountries : {[id: string] : string} = {
  "IT" : "Italy",
  "JP" : "Japan",
  "US" : "United States",
  "FR" : "France",
}

async function GetMovie(genre: string, year: string, region: string) {
  const genreId = genresToIds[genre]
  let yearString = `&primary_release_year=${year}`
  if (year == "any") {
    yearString = ""
  }
  const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&with_origin_country=${region}${yearString}`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.MOVIE_DB_API_KEY}`
    }
  };

  const response = await fetch(url, options)
  console.log(response)
  const jsonResp = await response.json()
  const movieResults = jsonResp.results

  if (!movieResults || movieResults.length <= 0) {
    return null
  }

  var movie = movieResults[Math.floor(Math.random()*movieResults.length)];
  return movie;
}


function ReturnUnverified(c: any, message: string) {
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        > {`${message}`}
        </div>
      </div>
    ),
  })
}

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
