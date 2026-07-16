//!loadmanually
var kelasManager = requireScript("../libs/libkelas.js")
var luck = requireScript("../libs/libluckperms.js")

addCommand("kelas", {
  onCommand: function(sender, args) {
    var jsArgs = toArray(args)
    var aksi = jsArgs[0]
    var restArgs = jsArgs.slice(1);

    switch (aksi) {
      case "tambah":
        kelasManager.addGroup(restArgs[0], restArgs[1] ? parseInt(restArgs[1]) : 0);
        sender.sendMessage("§aKelas dibuat");
        break;
      case "hapus":
        kelasManager.removeGroup(restArgs[0], sender);
        break;
      default:
        sender.sendMessage("Gunakan /kelas tambah|hapus")
    }
    
  }
}, "under.manage");

addCommand("lpgroup", {
  onCommand: function(sender, args) {
    if (args.length < 2) {
      sender.sendMessage("Gunakan §e/lpgroup setprefix|removeprefix <grup> [text]");
    }

    var jsArgs = toArray(args);
    var aksi = jsArgs[0];
    var groupName = jsArgs[1];
    var textPrefix = jsArgs.slice(2).join("");

    switch (aksi) {
      case "setprefix":
        if (!textPrefix) {
          sender.sendMessage("§cGunakan /lpgroup setprefix <grup> [text]");
          return;
        }
        luck.setPrefix(groupName, textPrefix);
        sender.sendMessage("Success")
        break;

      case "removeprefix":
        luck.removePrefix(groupName);
        sender.sendMessage("Success")
        break;

      default:
        sender.sendMessage("§cAksi tidak dikenali")
    } 
  },

  onTabComplete: function(sender, args) {
    var jsArgs = toArray(args);
    if (jsArgs.length === 1) {
      return toJavaList(["setprefix", "removeprefix"]);
    }
    return toJavaList([])
  }
}, "under.manage");
