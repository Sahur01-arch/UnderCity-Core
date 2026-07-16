// CHANGELOG
// V1.0.0 -> UPDATE
//!loadmanually
var Bukkit = importClass("org.bukkit.Bukkit");
const LuckPermsProvider = importClass("net.luckperms.api.LuckPermsProvider");

task.waitForPlugin("LuckPerms");

function addGroup(name, weight) {
  weight = (typeof weight === "number") ? weight : 0;

  task.main(function() {
    var console = Bukkit.getConsoleSender();

    Bukkit.dispatchCommand(console, "lp creategroup " + name);
    task.wait(1);
    Bukkit.dispatchCommand(console, "lp group " + name + " setweight " + weight);
  });

  log.info("Grup " + name + " weight " + weight);
}

function removeGroup(name, sender) { // Menambahkan parameter sender agar command berjalan lancar
  var luckPerms = LuckPermsProvider.get();
  var group = luckPerms.getGroupManager().getGroup(name);

  if (group === null) {
    if (sender) sender.sendMessage("§cGroup " + name + " Not Found");
    return;
  }

  task.main(function() {
    var console = Bukkit.getConsoleSender();
    Bukkit.dispatchCommand(console, "lp deletegroup " + name);
  });
}

// === FUNGSI TAMBAHAN: Mendapatkan Kelas/Group Siswa dari LuckPerms ===
function ambilKelasSiswa(uuidString) {
  try {
    var luckPerms = LuckPermsProvider.get();
    var uuid = java.util.UUID.fromString(uuidString);
    var user = luckPerms.getUserManager().getUser(uuid);

    if (user === null) {
      // Jika user belum dimuat di memori, load manual secara sinkron/cepat
      var future = luckPerms.getUserManager().loadUser(uuid);
      user = future.join(); 
    }

    if (user !== null) {
      // Mengambil group primary (biasanya kelas siswa)
      return user.getPrimaryGroup();
    }
  } catch (e) {
    log.error("Gagal mengambil data kelas untuk UUID: " + uuidString + ". Error: " + e);
  }
  return null;
}

return {
  addGroup: addGroup,
  removeGroup: removeGroup,
  ambilKelasSiswa: ambilKelasSiswa // Mengekspos fungsi ke script lain
};

