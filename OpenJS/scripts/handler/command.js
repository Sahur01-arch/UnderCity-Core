//!loadmanually
const Bukkit = importClass("org.bukkit.Bukkit");
const kelasManager = requireScript("../libs/libkelas.js");
const luck = requireScript("../libs/libluckperms.js");
const Tugas = requireScript("../libs/libtugas.js");
const config = requireScript("../libs/config.js");
const ClassSys = requireScript("../libs/libclass.js");
const EventSys = requireScript("../libs/libeventschool.js");
const ReportSys = requireScript("../libs/libreportcard.js");

// --- EVENT LISTENER (Cegah Siswa/Guru Mengambil Item dari Virtual Chest) ---
registerEvent("org.bukkit.event.inventory.InventoryClickEvent", function(event) {
    const title = event.getView().getTitle();
    if (title && title.indexOf(config.inventory.tugasTitlePrefix) === 0) {
        const player = event.getWhoClicked();
        // Allow teachers/staff with permission OR operators to interact
        if (player.hasPermission("server.tugas.guru") || player.isOp()) {
            return;
        }
        event.setCancelled(true); // Membatalkan aksi klik (read-only) untuk orang lain
    }
});

// --- COMMAND: /kelas ---
addCommand("kelas", {
  onCommand: function(sender, args) {
    try {
        const jsArgs = toArray(args);
        const aksi = jsArgs[0];
        const restArgs = jsArgs.slice(1);

        switch (aksi) {
        case "tambah":
            if (!restArgs[0]) {
                sender.sendMessage("§cGunakan: /kelas tambah <nama_kelas> [weight]");
                return;
            }
            kelasManager.addGroup(restArgs[0], restArgs[1] ? parseInt(restArgs[1]) : 0);
            sender.sendMessage("§aKelas " + restArgs[0] + " berhasil dibuat di LuckPerms.");
            break;
        case "hapus":
            if (!restArgs[0]) {
                sender.sendMessage("§cGunakan: /kelas hapus <nama_kelas>");
                return;
            }
            kelasManager.removeGroup(restArgs[0], sender);
            break;
        default:
            sender.sendMessage("§cGunakan: /kelas tambah|hapus");
        }
    } catch (e) {
        sender.sendMessage("§cTerjadi kesalahan saat memproses command kelas.");
        log.error("Command /kelas error: " + e);
    }
  }
}, "under.manage");

// --- COMMAND: /lpgroup ---
addCommand("lpgroup", {
  onCommand: function(sender, args) {
    if (args.length < 2) {
      sender.sendMessage("§cGunakan: /lpgroup setprefix|removeprefix <grup> [text]");
      return;
    }

    const jsArgs = toArray(args);
    const aksi = jsArgs[0];
    const groupName = jsArgs[1];
    const textPrefix = jsArgs.slice(2).join(" ");

    switch (aksi) {
      case "setprefix":
        if (!textPrefix) {
          sender.sendMessage("§cGunakan: /lpgroup setprefix <grup> <text>");
          return;
        }
        luck.setPrefix(groupName, textPrefix);
        sender.sendMessage("§aPrefix berhasil diterapkan.");
        break;

      case "removeprefix":
        luck.removePrefix(groupName);
        sender.sendMessage("§aPrefix berhasil dihapus.");
        break;

      default:
        sender.sendMessage("§cAksi tidak dikenali.");
    } 
  },

  onTabComplete: function(sender, args) {
    const jsArgs = toArray(args);
    if (jsArgs.length === 1) {
      return toJavaList(["setprefix", "removeprefix"]);
    }
    return toJavaList([]);
  }
}, "under.manage");

// --- COMMAND: /tugas ---
addCommand("tugas", {
  onCommand: function(sender, args) {
    if (!(sender instanceof org.bukkit.entity.Player)) { 
      sender.sendMessage("§cCommand ini hanya bisa dijalankan di in-game.");
      return;
    }

    const jsArgs = toArray(args);
    const aksi = jsArgs[0];

    // Subcommand: /tugas cek <kelas> (Guru/Staff saja)
    if (aksi === "cek") {
      if (!sender.hasPermission("server.tugas.guru")) {
        sender.sendMessage("§cKamu tidak memiliki izin untuk memeriksa tugas kelas.");
        return;
      }
      if (jsArgs.length < 2) {
        sender.sendMessage("§cGunakan: /tugas cek <kelas>");
        return;
      }
      task.main(function() {
        Tugas.bukaChestUntukGuru(sender, jsArgs[1]);
      });
      return;
    }

    // Default Command: /tugas (Pengumpulan mandiri siswa)
    if (!aksi) {
      // Fix: Prioritize teacher role, but allow OPs to bypass
      if (sender.hasPermission("server.tugas.guru") && !sender.isOp()) {
          sender.sendMessage("§cSebagai Guru/Staff, gunakan '/tugas cek <kelas>' untuk memeriksa tugas.");
          return;
      }

      const namaKelas = kelasManager.ambilKelasSiswa(sender.getUniqueId().toString());
      if (!namaKelas) {
        sender.sendMessage("§cKamu belum terdaftar di kelas manapun (Grup LuckPerms kosong).");
        return;
      }

      task.main(function() {
        const hasil = Tugas.submitTugas(sender, namaKelas);
        sender.sendMessage(hasil.sukses ? "§a" + hasil.pesan : "§c" + hasil.pesan);
      });
      return;
    }

    sender.sendMessage("§cGunakan: /tugas (untuk submit) atau /tugas cek <kelas> (khusus guru)");
  },
  onTabComplete: function(sender, args) {
    const jsArgs = toArray(args);
    if (jsArgs.length === 1 && sender.hasPermission("server.tugas.guru")) {
      return toJavaList(["cek"]);
    }
    return toJavaList([]);
  }
}, "server.tugas.use");

// --- COMMAND: /attendance ---
addCommand("attendance", {
    onCommand: function(sender, args) {
        const jsArgs = toArray(args);
        if (jsArgs[0] === "mark") {
            const hasil = ClassSys.recordAttendance(sender.getUniqueId().toString(), "Present");
            sender.sendMessage(hasil.sukses ? "§a" + hasil.pesan : "§c" + hasil.pesan);
        } else {
            sender.sendMessage("§cGunakan: /attendance mark");
        }
    }
}, "server.attendance.use");

// --- COMMAND: /event ---
addCommand("event", {
    onCommand: function(sender, args) {
        const jsArgs = toArray(args);
        if (jsArgs[0] === "create") {
            if (jsArgs.length < 3) {
                sender.sendMessage("§cGunakan: /event create <nama> <tanggal>");
                return;
            }
            const hasil = EventSys.createEvent(jsArgs[1], jsArgs[2]);
            sender.sendMessage(hasil.sukses ? "§a" + hasil.pesan : "§c" + hasil.pesan);
        } else {
            sender.sendMessage("§cGunakan: /event create <nama> <tanggal>");
        }
    }
}, "server.event.manage");

// --- COMMAND: /report ---
addCommand("report", {
    onCommand: function(sender, args) {
        const jsArgs = toArray(args);
        if (jsArgs[0] === "set") {
            if (jsArgs.length < 4) {
                sender.sendMessage("§cGunakan: /report set <nama_player> <mapel> <nilai> [nama_kelas]");
                return;
            }
            
            const playerName = jsArgs[1];
            const subject = jsArgs[2];
            const grade = jsArgs[3];
            const groupName = jsArgs[4];
            
            // Get UUID automatically
            var player = Bukkit.getPlayer(playerName);
            var uuid;
            if (player) {
                uuid = player.getUniqueId().toString();
            } else {
                var offlinePlayer = Bukkit.getOfflinePlayer(playerName);
                uuid = offlinePlayer.getUniqueId().toString();
            }
            
            // Set grade
            const hasil = ReportSys.setGrade(uuid, playerName, subject, grade);
            sender.sendMessage(hasil.sukses ? "§a" + hasil.pesan : "§c" + hasil.pesan);
            
            // Assign group if provided and valid
            const validGroups = ["kelasa", "kelasb", "kelasc", "kelasd"];
            if (groupName && validGroups.indexOf(groupName.toLowerCase()) !== -1) {
                luck.assignGroup(playerName, groupName.toLowerCase());
                sender.sendMessage("§aPemain " + playerName + " telah ditambahkan ke grup " + groupName);
            }
            
        } else {
            sender.sendMessage("§cGunakan: /report set <nama_player> <mapel> <nilai> [nama_kelas]");
        }
    }
    onTabComplete: function(sender, args) {
        const jsArgs = toArray(args);
        if (jsArgs.length === 1) {
            return toJavaList(["set"]);
        }
        if (jsArgs.length === 5 && jsArgs[0] === "set") {
            return toJavaList(["kelasa", "kelasb", "kelasc", "kelasd"]);
        }
        return toJavaList([]);
    }
}, "server.grade.manage");