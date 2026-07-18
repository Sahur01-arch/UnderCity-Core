//!loadmanually
const FILENAME = "grade_data";

function loadData() {
    DiskApi.loadFile(FILENAME, false, false);
}

function saveData() {
    DiskApi.saveFile(FILENAME, false, false);
}

function setGrade(uuid, subject, grade) {
    loadData();
    const grades = DiskApi.getVar(FILENAME, uuid, {}, false);
    grades[subject] = grade;
    DiskApi.setVar(FILENAME, uuid, grades, false);
    saveData();
}

function getGrades(uuid) {
    loadData();
    return DiskApi.getVar(FILENAME, uuid, {}, false);
}

return {
    setGrade: setGrade,
    getGrades: getGrades
};
