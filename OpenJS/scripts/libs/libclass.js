//!loadmanually
const Bukkit = importClass("org.bukkit.Bukkit");

// Data management for attendance
const FILENAME = "attendance_data";

function loadData() {
    DiskApi.loadFile(FILENAME, false, false);
}

function saveData() {
    DiskApi.saveFile(FILENAME, false, false);
}

function recordAttendance(uuid, status) {
    loadData();
    const attendance = DiskApi.getVar(FILENAME, uuid, [], false);
    attendance.push({
        date: new Date().toLocaleDateString(),
        status: status
    });
    DiskApi.setVar(FILENAME, uuid, attendance, false);
    saveData();
    return true;
}

function getAttendance(uuid) {
    loadData();
    return DiskApi.getVar(FILENAME, uuid, [], false);
}

return {
    recordAttendance: recordAttendance,
    getAttendance: getAttendance
};
