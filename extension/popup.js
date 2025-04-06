async function handleInfo() {
    const url = await getActiveTabURL();
    let videoTitle;
    let downloadOptions;
    try {
        const response = await fetch("http://localhost:3000/api/getinfo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();
        console.log(data)
        
        videoTitle = data.title;
        downloadOptions = data.formats;

        if (downloadOptions && downloadOptions.length > 0) {
            const container = document.createElement("div");
            container.className = "mt-4";

            const title = document.createElement("p");
            title.textContent = "🎯 Direct Links:";
            container.appendChild(title);

            downloadOptions.forEach((option, index) => {
                const div = document.createElement("div");

                const button = document.createElement("button");
                button.textContent = option.resolution;
                button.className = "bg-blue-600 text-white px-3 py-1 rounded";
                button.addEventListener("click", () => {
                    handleDownload(url, option.formatID, videoTitle);
                });

                div.appendChild(button);
                container.appendChild(div);
            });

            // Append this whole thing somewhere on your page
            document.getElementById("download-section").appendChild(container);
        }


    } catch (err) {
        console.error("Fetch error:", err);
    }
}

async function handleDownload(url, videoFormatId, videoTitle) {
    try {
        const response = await fetch("http://localhost:3000/api/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url, videoFormatId, videoTitle })
        });
    }
    catch (err) {
        console.error("Error:", err);
        alert("Something went wrong. Check the console.");
    }

}
document.getElementById("getinfo").addEventListener("click", () => {
    handleInfo();
});

function getActiveTabURL() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                resolve(tabs[0].url);
            } else {
                reject("No active tab found");
            }
        });
    });
}
