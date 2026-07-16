//!loadmanually
var kelasManager = requireScript("../libs/libkelas.js");
var luck = requireScript("../libs/libluckperms.js");
var Tugas = requireScript("../libs/libtugas.js");

// --- EVENT LISTENER (Cegah Siswa/Guru Mengambil Item dari Virtual Chest) ---
registerEvent("org.bukkit.event.inventory.InventoryClickEvent", function(event) {
    var title = event.getView().getTitle();
    if (title && title.indexOf("§6Kumpulan Tugas-") === 0) {
        event.setCancelled(true); // Membatalkan aksi klik (read-only)
    }
});

// --- COMMAND: /kelas ---
addCommand("kelas", {
  onCommand: function(sender, args) {
    var jsArgs = toArray(args);
    var aksi = jsArgs[0];
    var restArgs = jsArgs.slice(1);

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
  }
}, "under.manage");

// --- COMMAND: /lpgroup ---
addCommand("lpgroup", {
  onCommand: function(sender, args) {
    if (args.length < 2) {
      sender.sendMessage("§cGunakan: /lpgroup setprefix|removeprefix <grup> [text]");
      return;
    }

    var jsArgs = toArray(args);
    var aksi = jsArgs[0];
    var groupName = jsArgs[1];
    var textPrefix = jsArgs.slice(2).join(" ");

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
    var jsArgs = toArray(args);
    if (jsArgs.length === 1) {
      return toJavaList(["setprefix", "removeprefix"]);
    }
    return toJavaList([]);
  }
}, "under.manage");

// --- COMMAND: /tugas ---
addCommand("tugas", {
  onCommand: function(sender, args) {
    if (!(sender instanceof org.bukkit.entity.Player)) { // PERBAIKAN: instanceOf -> instanceof
      sender.sendMessage("§cCommand ini hanya bisa dijalankan di in-game.");
      return;
    }

    var jsArgs = toArray(args);
    var aksi = jsArgs[0];

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
      var namaKelas = kelasManager.ambilKelasSiswa(sender.getUniqueId().toString());
      if (!namaKelas) {
        sender.sendMessage("§cKamu belum terdaftar di kelas manapun (Grup LuckPerms kosong).");
        return;
      }

      task.main(function() {
        var hasil = Tugas.submitTugas(sender, namaKelas);
        sender.sendMessage(hasil.sukses ? "§a" + hasil.pesan : "§c" + hasil.pesan);
      });
      return;
    }

    sender.sendMessage("§cGunakan: /tugas (untuk submit) atau /tugas cek <kelas> (khusus guru)");
  },
  onTabComplete: function(sender, args) {
    var jsArgs = toArray(args);
    if (jsArgs.length === 1 && sender.hasPermission("server.tugas.guru")) {
      return toJavaList(["cek"]);
    }
    return toJavaList([]);
  }
}, "server.tugas.use");

