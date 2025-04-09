async function handleInfo(data, url) {
    // const url = await getActiveTabURL();
    let videoTitle;
    let downloadOptions;
    // try {
        //     const response = await fetch("http://localhost:3000/api/getinfo", {
            //         method: "POST",
            //         headers: {
                //             "Content-Type": "application/json"
                //         },
            //         body: JSON.stringify({ url })
            //     });

        //     const data = await response.json();
        //     console.log(data)

        videoTitle = data.title;
        downloadOptions = data.formats;

        if (downloadOptions && downloadOptions.length > 0) {
            const links = document.getElementById("links");
            links.innerHTML = "";

            const title = document.createElement("p");
            title.textContent = "Title: " + videoTitle;
            title.id = "title";
            links.appendChild(title);

            const infoText= document.createElement("p");
            infoText.textContent = "Download Links:";
            infoText.id = "infoText";
            links.appendChild(infoText);

            downloadOptions.forEach((option, index) => {
                const link = document.createElement("div");
                link.className = "link";

                const quality = document.createElement("p");
                quality.textContent = "📺 Quality: " + option.resolution + "p";
                link.appendChild(quality);

                const size = document.createElement("p");
                size.textContent = "📂 Size: " + option.sizeMB;
                link.appendChild(size);

                const button = document.createElement("button");
                button.textContent = "Yoink;)";
            button.className = "yoink";
            button.addEventListener("click", () => {
                handleDownload(url, option.formatID, videoTitle);
            });

                link.appendChild(button);
                links.appendChild(link);
            });
        }
    }

    async function handleDownload(url, videoFormatId, videoTitle) {
        try {
            showToast("Check Your Downloads Directory", "Downloading...");
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

    // document.getElementById("getinfo").addEventListener("click", () => {
        //     handleInfo();
        // });

    document.addEventListener("DOMContentLoaded", () => {
        const status = document.getElementById("is-fetching");

        chrome.storage.local.get("ytData", (result) => {
            const data = result.ytData;
            if (data) {
                status.style.display = "none";
                console.log("Using pre-fetched data:", data);
                handleInfo(data, data.url);
            } else {
                status.style.display = "block";
                console.log("No prefetched data found");
            }
        });

        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === "local" && changes.ytData?.newValue) {
                const newData = changes.ytData.newValue;
                console.log("Data updated, refreshing UI:", newData);
                status.style.display = "none";
                handleInfo(newData, newData.url);
            }
        });
    });

    // function getActiveTabURL() {
        //     return new Promise((resolve, reject) => {
            //         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                //             if (tabs && tabs.length > 0) {
                    //                 resolve(tabs[0].url);
                    //             } else {
                        //                 reject("No active tab found");
                        //             }
                //         });
            //     });
        // }



    const timeout = 5000; 

    function showToast(message, type = "success") {
        const toastContainer = document.querySelector(".toast-container");

        const toast = document.createElement("div");
        toast.classList.add("toast", type);

        toast.innerHTML = `
            <div class="toast-content">
            <i id="icon" class="bi bi-check-circle-fill"></i>
            <div class="message">
            <span class="text text-1">${capitalize(type)}</span>
            <span class="text text-2">${message}</span>
            </div>
            </div>
            <i class="bi bi-x-lg close"></i>
            <div class="progress active"></div>
            `;

        toastContainer.appendChild(toast);
        let showToast = setTimeout(() => {
            void toast.offsetHeight;
            toast.classList.add("active");
        }, 1);

        const progress = toast.querySelector(".progress");
        const closeIcon = toast.querySelector(".close");

        // Auto-remove toast after 5s
        const timer1 = setTimeout(() => {
            toast.classList.remove("active");
        }, timeout);

        const timer2 = setTimeout(() => {
            progress.classList.remove("active");
            setTimeout(() => toast.remove(), 400);
        }, timeout + 300);

        // Manual close
        closeIcon.addEventListener("click", () => {
            toast.classList.remove("active");
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(showToast);
            setTimeout(() => toast.remove(), 400);
        });
    }

    function getIcon(type) {
        switch (type) {
            case "success": return "check-circle-fill";
            default: return "check-circle-fill";
        }
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }




