let isSelecting = false;

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    if(request.text === "isSelecting") {
        isSelecting = request.isWritingToFile;
    }
});

chrome.commands.onCommand.addListener(function(command) {
    if(command === "copy-text" && isSelecting) {

        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

            chrome.tabs.executeScript({code: "window.getSelection().toString();"}, results => {

                chrome.storage.local.get(items => {

                    let resultObj = buildContentArray(items, tabs[0].url, results[0] + "\n\n", getCurrentDate());

                    chrome.storage.local.set({"fileString": resultObj});
                });
            })
        });
    }
});

const buildContentArray = (items, url, content, date) => {
    let contentArray = items["fileString"];

    if(Array.isArray(contentArray) && Object.keys(contentArray).length === 0) {
        let currentObject = {"url": url, "dailyContent": [{"date": date, "content": content}]}
        contentArray.push(currentObject);
        return contentArray;
    }

    for(pageContent of contentArray) {
        if(url === pageContent.url) {

            for(contentForDay of pageContent.dailyContent) {
                if(date === contentForDay.date) {

                    contentForDay.content = contentForDay.content.concat(content);
                    return contentArray;
                }
            }
            pageContent.dailyContent.push({"date": date, "content": content});
            return contentArray;
        }
    }
    let currentObject = {"url": url, "dailyContent": [{"date": date, "content": content}]}
    contentArray.push(currentObject);
    return contentArray;
}

const getCurrentDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today;
}
