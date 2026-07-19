//!loadmanually
const FILENAME = "grade_data";

function loadData() {
    DiskApi.loadFile(FILENAME, false, false);
}

function saveData() {
    DiskApi.saveFile(FILENAME, false, false);
}

function calculateAverage(grades) {
    var sum = 0;
    var count = 0;
    for (var subject in grades) {
        sum += parseFloat(grades[subject]);
        count++;
    }
    return count === 0 ? 0 : (sum / count).toFixed(2);
}

function setGrade(uuid, playerName, subject, grade) {
  if (!uuid || !playerName || !subject || !grade) {
  log.error("[libreportcard.js] Gagal set nilai: Input tidak lengkap");
  return {  sukses: false, pesan: "Data nilai tidak lengkap"};

  try {
    loadData();
    //ambil Data
    var rawRecord = DiskApi.getVar(FILENAME, uuid, null, false);
    var record;

    if (rawRecord) {
      record = JSON.parse(rawRecord);
    } else {
        record = { uuid: uuid, name: playerName, grades: {}, average: 0 };
    }

    record.name = playerName;
    record.grades[subject] = grade;
    record.average = calculateAverage(record.grades);

    DiskApi.setVar(FILENAME, uuid, JSON.stringify(record), false);
    saveData();

    log.info("[libreportcard.js] Nilai " + subject + " diatur ke " + grade + " untuk " + playerName + " (" + uuid +")");
    return { sukses: true, pesan: "Nilai " + subject + " untuk " + playerName + " berhasil diatur menjadi " + grade + ". Rata-rata: " + record.average };
  } catch (e) {
    log.error("[libreportcard] Error saat mengatur nilai : " + e);
    return { sukses: false, pesan: "Terjadi kesalahan internal saat mengatur nilai." };
  }
}

function getReport(uuid) {
    if (!uuid) return null;
    loadData();
    return DiskApi.getVar(FILENAME, uuid, null, false);
}

return {
    setGrade: setGrade,
    getReport: getReport
};
