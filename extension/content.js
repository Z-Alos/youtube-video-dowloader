(async () => {
    console.log("Extension script running...");
    url = window.location.href;
    console.log(url)

  if (!url) return alert("No URL entered, boss.");

  try {
    const response = await fetch("https://youtube-video-dowloader-5ezh.onrender.com/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (data.directDownloadURL) {
      // Open the direct download URL in a new tab
      chrome.tabs.create({ url: data.directDownloadURL });
    } else {
      console.error("Error:", data);
      alert("Download failed: " + (data.details || "No link received"));
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Server error. Try again later.");
  }

})();
