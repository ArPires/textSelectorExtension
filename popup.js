const createFileButton = document.getElementById("create-file");
const downloadFileButton = document.getElementById("download-file");
const deleteFileButton = document.getElementById("delete-file");

window.onload = () => {
    getCurrentPopupState();
}

createFileButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({text: "setState", createFile: "none", downloadFile: "visible", deleteFile: "visible", instructions: "visible"});

    chrome.runtime.sendMessage({text: "isSelecting", isWritingToFile: true});

    chrome.storage.local.set({"fileString": []});
});

downloadFileButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({text: "isSelecting", isWritingToFile: false});
    
    chrome.storage.local.get(items => {
        let fileString = buildFileStringFromContentArray(items["fileString"]);

        download("", fileString);
    });

    chrome.storage.local.remove("fileString");

    chrome.runtime.sendMessage({text: "setState",createFile: "block", downloadFile: "hidden", deleteFile: "hidden", instructions: "hidden"});
});

deleteFileButton.addEventListener("click", () => {
    chrome.storage.local.remove("fileString");

    chrome.runtime.sendMessage({text: "setState",createFile: "block", downloadFile: "hidden", deleteFile: "hidden", instructions: "hidden"});
})

const buildFileStringFromContentArray = (contentArray) => {
    let resultString = "";

    for(pageContent of contentArray) {
        resultString = resultString.concat(pageContent.url + "\n\n");

        for(contentForDay of pageContent.dailyContent) {
            resultString = resultString.concat(contentForDay.date + "\n\n");
            resultString = resultString.concat(contentForDay.content);
        }
    }
    return resultString;
}

const download = (fileName, text) => {
    let iframeElement = document.createElement("iframe");
    iframeElement.setAttribute("style","width:0; height:0; border:0; border:none");

    let anchorElement = document.createElement('a');
    anchorElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    anchorElement.setAttribute('download', fileName);

    iframeElement.appendChild(anchorElement);
    document.body.appendChild(iframeElement);

    anchorElement.click();

    document.body.removeChild(iframeElement);
}

const getCurrentPopupState = () => {
    chrome.runtime.sendMessage({ text: "getState" }, response => {
        document.getElementById("create-file").style.display = response.createFile;
        document.getElementById("download-file").style.visibility = response.downloadFile;
        document.getElementById("delete-file").style.visibility = response.deleteFile;
        document.getElementById("instructions").style.visibility = response.instructions;
    });
}
