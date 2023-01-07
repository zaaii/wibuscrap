const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(morgan("dev"));
app.set("json spaces", 2);
app.use(express.json());

app.get("*", (req, res) => {
    res.status(200).json({
      api_name: "Wibu Scrapper",
      end_points: {
        "/api/anoboy": "Mendapatkan data dari website Anoboy",
        "/api/otakudesu": "Mendapatkan data dari website otakudesu",
        "/api/dorama": "Mendapatkan data dari website doramaindo",
        "/api/komikcast": "Mendapatkan data dari website komikcast",
        "/api/komiku": "Mendapatkan data dari website komiku",
      },
      repository: "https://github.com/zaaii/wibuscrap",
      social: {
        github: "https://github.com/zaaii",
        twitter: "https://twitter.com/iyazaii",
      },
    });
  });

/// Use Komiku route
app.use("/api/komiku/", require("./routes/komiku-route.js"));

/// Use Anoboy route
app.use("/api/anoboy/", require("./routes/anoboy-route.js"));

// Use Otakudesu route
app.use("/api/otakudesu/", require("./routes/otakudesu-route.js"));

/// Use Dorama route
app.use("/api/dorama/", require("./routes/dorama-route.js"));

/// Use Komikcast route
app.use("/api/komikcast/", require("./routes/manga-route.js"));

/// Listen to certain port
app.listen(port, () => console.log(`server running on port ${port}`));
