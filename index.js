const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(morgan("dev"));

app.use(express.json());

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
