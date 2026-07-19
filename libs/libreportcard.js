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
        log.error("[libreportcard] Gagal set nilai: Input tidak lengkap.");
        return { sukses: false, pesan: "Data nilai tidak lengkap." };
    }
    
    try {
        loadData();
        // 1. Ambil data mentah berupa String dari DiskApi
        var rawRecord = DiskApi.getVar(FILENAME, uuid, null, false);
        var record;

        // 2. Jika data ada, parse dari JSON string. Jika tidak, buat object baru
        if (rawRecord) {
            record = JSON.parse(rawRecord);
        } else {
            record = { uuid: uuid, name: playerName, grades: {}, average: 0 };
        }
        
        record.name = playerName; // Update name just in case
        record.grades[subject] = grade;
        record.average = calculateAverage(record.grades);
        
        // 3. Ubah object menjadi string JSON sebelum disimpan
        DiskApi.setVar(FILENAME, uuid, JSON.stringify(record), false);
        saveData();
        
        log.info("[libreportcard] Nilai " + subject + " diatur ke " + grade + " untuk " + playerName + " (" + uuid + ")");
        return { sukses: true, pesan: "Nilai " + subject + " untuk " + playerName + " berhasil diatur menjadi " + grade + ". Rata-rata: " + record.average };
    } catch (e) {
        log.error("[libreportcard] Error saat mengatur nilai: " + e);
        return { sukses: false, pesan: "Terjadi kesalahan internal saat mengatur nilai." };
    }
}

function getReport(uuid) {
  if (!uuid) return null;
  loadData();
  var rawRecord = DiskApi.getVar(FILENAME, uuid, null, false);

  return rawRecord ? JSON.parse(rawRecord) : null;
}

return {
  setGrade: setGrade,
  getReport: getReport
};
