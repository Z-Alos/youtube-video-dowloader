chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active && tab.url.startsWith("http")) {
        chrome.storage.local.remove("ytData");

        const url = tab.url;

        try {
            const response = await fetch("http://localhost:3000/api/getinfo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            if (!data || typeof data !== 'object') {
                console.error("Invalid data received:", data);
                return;
            }
            console.log(data)
            data.url = url;
            chrome.storage.local.set({ ytData: data }, () => {
                console.log("Prefetched info stored ✅", data);
            });

        } catch (err) {
            console.error("Failed to prefetch:", err);
        }
    }
});

