//!loadmanually
const Bukkit = importClass("org.bukkit.Bukkit")

function setPrefix(groupName, prefixText) {
  var safeText = prefixText.replace(/"/g, "");
  var cmd = 'lp group ' + groupName + ' meta setprefix "' + safeText + '"';
  log.info("DEBUG cmd = " + cmd);

  task.main(function() {
    var console = Bukkit.getConsoleSender();
    Bukkit.dispatchCommand(console, 'lp group ' + groupName + ' meta setprefix "' + safeText + '"');
  });
}

function removePrefix(groupName) {
  task.main(function() {
    var console = Bukkit.getConsoleSender();
    Bukkit.dispatchCommand(console, console, 'lp group ' + groupName + ' meta setprefix ""');
  });
}

return {
  setPrefix: setPrefix,
  removePrefix: removePrefix
};
