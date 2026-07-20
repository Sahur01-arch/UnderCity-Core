//!loadmanually
const Bukkit = importClass("org.bukkit.Bukkit")

function setPrefix(groupName, prefixText, sender) {
  const safeText = prefixText.replace(/"/g, "");

  task.main(function() {
    try {
      const console = Bukkit.getConsoleSender();
      Bukkit.dispatchCommand(console, 'lp group ' + groupName + ' meta setprefix "' + safeText + '"');
      if (sender) sender.sendMessage("§aPrefix untuk " + groupName + " berhasil diterapkan.");
    } catch (e) {
      log.error("Gagal menetapkan prefix untuk " + groupName + ": " + e);
      if (sender) sender.sendMessage("§cGagal menerapkan prefix: " + e);
    }
  });
}

function removePrefix(groupName, sender) {
  task.main(function() {
    try {
      const console = Bukkit.getConsoleSender();
      Bukkit.dispatchCommand(console, 'lp group ' + groupName + ' meta setprefix ""');
      if (sender) sender.sendMessage("§aPrefix untuk " + groupName + " berhasil dihapus.");
    } catch (e) {
      log.error("Gagal menghapus prefix untuk " + groupName + ": " + e);
      if (sender) sender.sendMessage("§cGagal menghapus prefix: " + e);
    }
  });
}

function assignGroup(playerName, groupName, sender) {
  task.main(function() {
    try {
      const console = Bukkit.getConsoleSender();
      Bukkit.dispatchCommand(console, 'lp user ' + playerName + ' parent add ' + groupName);
      if (sender) sender.sendMessage("§aPemain " + playerName + " telah ditambahkan ke grup " + groupName);
      log.info("Berhasil menambahkan " + playerName + " ke grup " + groupName);
    } catch (e) {
      log.error("Gagal menambahkan " + playerName + " ke grup " + groupName + ": " + e);
      if (sender) sender.sendMessage("§cGagal menambahkan ke grup: " + e);
    }
  });
}

return {
  setPrefix: setPrefix,
  removePrefix: removePrefix,
  assignGroup: assignGroup
};
