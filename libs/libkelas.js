// CHANGELOG
// V1.0.0 -> UPDATE
//!loadmanually
var Bukkit = importClass("org.bukkit.Bukkit");
const LuckPermsProvider = importClass("net.luckperms.api.LuckPermsProvider");

var daftarKelas = ["kelasa", "kelasb", "kelasc", "kelasd"]

function addGroup(name, weight, sender) {
  weight = (typeof weight === "number") ? weight : 0;

  task.main(function() {
    try {
      var console = Bukkit.getConsoleSender();
      Bukkit.dispatchCommand(console, "lp creategroup " + name);
      Bukkit.dispatchCommand(console, "lp group " + name + " setweight " + weight);
      log.info("Grup " + name + " weight " + weight);
      if (sender) sender.sendMessage("§aKelas " + name + " berhasil dibuat di LuckPerms.");
    } catch (e) {
      log.error("Gagal membuat grup " + name + ": " + e);
      if (sender) sender.sendMessage("§cGagal membuat kelas: " + e);
    }
  });
}

function removeGroup(name, sender) {
  var luckPerms = LuckPermsProvider.get();
  var group = luckPerms.getGroupManager().getGroup(name);

  if (group === null) {
    if (sender) sender.sendMessage("§cGroup " + name + " Not Found");
    return;
  }

  task.main(function() {
    try {
      var console = Bukkit.getConsoleSender();
      Bukkit.dispatchCommand(console, "lp deletegroup " + name);
      if (sender) sender.sendMessage("§aKelas " + name + " berhasil dihapus.");
    } catch (e) {
      log.error("Gagal menghapus grup " + name + ": " + e);
      if (sender) sender.sendMessage("§cGagal menghapus kelas: " + e);
    }
  });
}

// === FUNGSI TAMBAHAN: Mendapatkan Kelas/Group Siswa dari LuckPerms ===
function ambilKelasSiswa(uuidString) {
  try {
    var luckPerms = LuckPermsProvider.get();
    var uuid = java.util.UUID.fromString(uuidString);
    var user = luckPerms.getUserManager().getUser(uuid);

    if (user === null) {
      var future = luckPerms.getUserManager().loadUser(uuid);
      user = future.join(); // Fixed: assigned result of future.join()
    }

    if (user !== null) {
      var nodes = user.getNodes();
      var daftarGrup = [];

      var iterator = nodes.iterator();
      while (iterator.hasNext()) {
        var node = iterator.next();
        if (node.getType().toString() === "INHERITANCE") {
          daftarGrup.push(node.getGroupName());
        }
      }

      for (var i = 0; i < daftarGrup.length; i++) {
        if (daftarKelas.indexOf(daftarGrup[i]) !== -1) {
          return daftarGrup[i];
        }
      }
    }
  } catch (e) {
    log.info("Gagal mengambil data kelas untuk UUID: " + uuidString + ".Error " + e);
  }
  return null;
}

function cekKelasValid(sender) {
  if (sender.isOp() || sender.hasPermission("under.tugas.bypass")) {
    return { valid: true, kelas: "STAFF", pesan: "" };
  }

  var uuidString = sender.getUniqueId().toString();
  var namaGrup = ambilKelasSiswa(uuidString);

  if (!namaGrup || namaGrup === "default") {
    return { valid: false, kelas: null, pesan: "kamu belum terdaftar di kelas manapun" };
  }

  if (daftarKelas.indexOf(namaGrup) === -1) {
    return { valid: false, kelas: null, pesan: "Grup kamu ('" + namaGrup + "') bukan kelas yang valid untuk submit tugas." };
  }

  return { valid: true, kelas: namaGrup, pesan: "" };
}

return {
  addGroup: addGroup,
  removeGroup: removeGroup,
  ambilKelasSiswa: ambilKelasSiswa // Mengekspos fungsi ke script lain
};

