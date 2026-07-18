//!loadmanually
const Bukkit = importClass("org.bukkit.Bukkit");

const FILENAME = "attendance_data";

function loadData() {
    DiskApi.loadFile(FILENAME, false, false);
}

function saveData() {
    DiskApi.saveFile(FILENAME, false, false);
}

function recordAttendance(uuid, status) {
    if (!uuid || !status) {
        log.error("[libclass] Gagal catat absensi: UUID atau status tidak valid.");
        return { sukses: false, pesan: "Data absensi tidak lengkap." };
    }
    
    try {
        loadData();
        const attendance = DiskApi.getVar(FILENAME, uuid, [], false);
        attendance.push({
            date: new Date().toLocaleDateString(),
            status: status
        });
        DiskApi.setVar(FILENAME, uuid, attendance, false);
        saveData();
        log.info("[libclass] Absensi dicatat untuk UUID: " + uuid);
        return { sukses: true, pesan: "Absensi berhasil dicatat sebagai: " + status };
    } catch (e) {
        log.error("[libclass] Error saat mencatat absensi: " + e);
        return { sukses: false, pesan: "Terjadi kesalahan internal saat mencatat absensi." };
    }
}

function getAttendance(uuid) {
    if (!uuid) return [];
    loadData();
    return DiskApi.getVar(FILENAME, uuid, [], false);
}

return {
    recordAttendance: recordAttendance,
    getAttendance: getAttendance
};
