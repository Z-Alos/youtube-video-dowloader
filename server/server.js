const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ytdlp = require("yt-dlp-exec").raw;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required." });

  try {
    const output = await ytdlp(
      url,
      {
        dumpSingleJson: true,
        noWarnings: true,
        noCheckCertificates: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
      }
    );

    let json = JSON.parse(output);
    let directDownloadURL = json?.url || json?.formats?.at(-1)?.url;

    if (!directDownloadURL) {
      return res.status(500).json({ error: "Failed to get download URL." });
    }

    res.json({ directDownloadURL });
  } catch (err) {
    console.error("yt-dlp failed:", err);
    res.status(500).json({ error: "yt-dlp execution failed", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🛰️ yt-dlp-exec server is flying high at http://localhost:${PORT}`);
});
