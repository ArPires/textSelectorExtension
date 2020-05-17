const stateObject = {
    createFile: "block",
    downloadFile: "hidden",
    deleteFile: "hidden",
    instructions: "hidden"
}

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    if(request.text === "getState") {
        sendResponse(stateObject)
    }
});

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    if(request.text === "setState") {
        setStateOnClick(request);
        setStateOnTemporaryMemory(request);
    }
});

const setStateOnClick = (request) => {
    let popupWindow = chrome.extension.getViews({ type: "popup" });
    popupWindow[0].document.getElementById("create-file").style.display = request.createFile;
    popupWindow[0].document.getElementById("download-file").style.visibility = request.downloadFile;
    popupWindow[0].document.getElementById("delete-file").style.visibility = request.deleteFile;
    popupWindow[0].document.getElementById("instructions").style.visibility = request.instructions;
}

const setStateOnTemporaryMemory = (request) => {
    stateObject.createFile = request.createFile;
    stateObject.downloadFile = request.downloadFile;
    stateObject.deleteFile = request.deleteFile;
    stateObject.instructions = request.instructions;
}

