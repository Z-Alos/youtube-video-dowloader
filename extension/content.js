(async () => {
    console.log("Extension script running...");
    url = window.location.href;
    console.log(url)

  try {
    const response = await fetch("http://localhost:3000/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    console.log(data)
    if (data.directDownloadURL) {
        console.log("i got something", data.directDownloadURL)
        // Auto-trigger download
      const a = document.createElement("a");
      a.href = data.directDownloadURL;
      a.download = ""; // optional: specify filename like "file.pdf"
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error("Error:", data);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }

})();
