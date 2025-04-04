const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/download", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required." });

  const command = `yt-dlp -g "${url}"`;

  exec(command, (err, stdout, stderr) => {
    if (err || stderr) {
      return res.status(500).json({ error: "yt-dlp execution failed", details: stderr });
    }

    const directDownloadURL = stdout.trim();
    return res.json({ directDownloadURL });
  });
});

app.listen(PORT, () => {
  console.log(`yt-dlp fetch server running at http://localhost:${PORT}`);
});

