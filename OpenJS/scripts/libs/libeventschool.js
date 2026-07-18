//!loadmanually
const FILENAME = "event_data";

function loadData() {
    DiskApi.loadFile(FILENAME, false, false);
}

function saveData() {
    DiskApi.saveFile(FILENAME, false, false);
}

function createEvent(name, date) {
    loadData();
    const events = DiskApi.getVar(FILENAME, "events", [], false);
    events.push({name: name, date: date});
    DiskApi.setVar(FILENAME, "events", events, false);
    saveData();
}

function getEvents() {
    loadData();
    return DiskApi.getVar(FILENAME, "events", [], false);
}

return {
    createEvent: createEvent,
    getEvents: getEvents
};
