function doMagic() {
  chrome.tabs.executeScript(null, {file: "bower_components/raphael/raphael-min.js"});
  chrome.tabs.executeScript(null, {file: "bower_components/jquery/dist/jquery.min.js"});
  chrome.tabs.executeScript(null, {file: "bower_components/jquery-ui/jquery-ui.min.js"});
  chrome.tabs.executeScript(null, {file: "bower_components/underscore/underscore-min.js"});
  chrome.tabs.insertCSS(null, {file: "style.css"});
  chrome.tabs.executeScript(null, {file: "vexchords/js/chart.js"});
  chrome.tabs.executeScript(null, {file: "vexchords/js/chord.js"});
  chrome.tabs.executeScript(null, {file: "chords.js"});
  chrome.tabs.executeScript(null, {file: "hoverChords.js"});
}


chrome.browserAction.onClicked.addListener(doMagic);

chrome.contextMenus.create({"title": "Mandochord!",
    "contexts": ["selection", "link"],
                           "onclick": doMagic
});
