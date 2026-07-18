//!loadmanually
const FILENAME = "event_data";

function loadData() {
    DiskApi.loadFile(FILENAME, false, false);
}

function saveData() {
    DiskApi.saveFile(FILENAME, false, false);
}

function createEvent(name, date) {
    if (!name || !date) {
        log.error("[libeventschool] Gagal buat event: Nama atau tanggal tidak valid.");
        return { sukses: false, pesan: "Data event tidak lengkap." };
    }
    
    try {
        loadData();
        const events = DiskApi.getVar(FILENAME, "events", [], false);
        events.push({name: name, date: date});
        DiskApi.setVar(FILENAME, "events", events, false);
        saveData();
        log.info("[libeventschool] Event '" + name + "' berhasil dibuat.");
        return { sukses: true, pesan: "Event '" + name + "' berhasil dijadwalkan pada " + date + "." };
    } catch (e) {
        log.error("[libeventschool] Error saat buat event: " + e);
        return { sukses: false, pesan: "Terjadi kesalahan internal saat membuat event." };
    }
}

function getEvents() {
    loadData();
    return DiskApi.getVar(FILENAME, "events", [], false);
}

return {
    createEvent: createEvent,
    getEvents: getEvents
};
