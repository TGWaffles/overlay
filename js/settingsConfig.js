const Store = require('electron-store');
const { app } = require('electron').remote
const dialog = require('electron').remote.dialog 

const store = new Store();

const toggleMenu = () => {
    document.getElementById("menu").classList.toggle("hidden");
}

const writeToStorage = (key, value) => {
    store.set(key, value)
    console.log(value)
    return value;
}

const readFromStorage = key => {
    var val = store.get(key);
    console.log(val)
    return val || undefined;
}

const deleteFromStorage = key => {
    store.delete(key)
}

const pathBtn = document.getElementById("path-input");

pathBtn.onclick = () => {
    var options = {
        title: 'Select the latest.log file you wish to use.', 
        buttonLabel: 'Select',  
        filters: [ { name: 'Log Files', extensions: ['log'] } ], 
        properties: ['openFile'] 
    }

    if (process.platform !== 'darwin') options.properties.push('OpenDirectory')

    dialog.showOpenDialog(options, filePath_obj => { 
        if (filePath_obj) {
            writeToStorage('path', filePath_obj[0].replace(/\\/g, "\/"))
            
            var window = remote.getCurrentWindow()
            window.reload()
        } 
    });
}

var lastClient = "vf";

const clientSwitcher = () => {
    var client = document.getElementById("logMode").value
    if (client == lastClient) return;
    lastClient = client;

    var path = app.getPath("home").replace(/\\/g, "\/");

    if (client == "vf") path += "/AppData/Roaming/.minecraft/logs/";
    else if (client == "bc") path += "/AppData/Roaming/.minecraft/logs/blclient/minecraft/";
    else if (client == "lc") path += "/.lunarclient/offline/files/1.8.9/logs/";
    else if (client == "plc") path += "/AppData/Roaming/.pvplounge/logs/";

    path += "latest.log"
    
    fs.open(path, 'r', (err, fd) => {
        if (!fd) {
            document.getElementById("errorMsg").innerHTML = `
            <div class="error">
                <img class="error-img" src="./img/icons/error.png" />
                <div class="error-header">An Unexpected Error Occured</div>
                <br />
                <div class="error-content">
                <p>The log file associated with that log file, try reinstalling the client in the default location or manually selecting the log file.</p>
                </div>
            </div>
          `

          return;
        }
        else document.getElementById("errorMsg").innerHTML = ``;

        writeToStorage("path", path)

       var window = remote.getCurrentWindow()
       window.reload()
    })
}