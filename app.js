// import { YoutubeTranscript } from "youtube-transcript";
let { YoutubeTranscript } = require("youtube-transcript");
const express = require("express");
const app = express();
const path = require("path");

const dotenv = require('dotenv')
dotenv.config();
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse form data
app.set("view engine", "ejs");

// function getTranscript() {
//   let url = Document.querySelector("#urlInp").value;

//   console.log(url);

//   YoutubeTranscript.fetchTranscript(url).then((res) => {
//     for (let x of res) {
//       console.log(x["text"]);
//     }
//   });
// }

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/home.html"));
});

//route to load transcript.html
app.get("/youtube-transcript", (req, res) => {
  console.log("request recieved");
  res.sendFile(path.join(__dirname, "/public/transcript.html"));
});

// route to get video url & display trancript
app.post("/youtube_transcript", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.send("Video URL is required");
    }

    let transcript = await YoutubeTranscript.fetchTranscript(url);

    function extractVideoID(url) {
      if (url.includes("youtu.be/")) {
        return url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("youtube.com/watch?v=")) {
        return url.split("v=")[1].split("&")[0];
      }
      return "";
    }
    const videoID = extractVideoID(url);

    res.render("transcript", { transcript,videoID }); // No need to wrap in `{ data }`
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transcript" });
  }
});
console.log(PORT)
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
