const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ytdlp = require("yt-dlp-exec"); // ✅ use the default export

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/download", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  try {
    const output = await ytdlp(url, {
      getUrl: true,
      format: "best",
    });

    const directDownloadURL = output.trim();
    res.json({ directDownloadURL });
  } catch (error) {
    res.status(500).json({
      error: "yt-dlp execution failed",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 yt-dlp server cruising at http://localhost:${PORT}`);
});
