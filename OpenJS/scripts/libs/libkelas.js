// CHANGELOG
// V1.0.0 -> UPDATE
//!loadmanually
var Bukkit = importClass("org.bukkit.Bukkit");
const LuckPermsProvider = importClass("net.luckperms.api.LuckPermsProvider");

task.waitForPlugin("LuckPerms")

function addGroup(name, weight) {
  weight = (typeof weight === "number") ? weight: 0;

  task.main(function() {
    var console = Bukkit.getConsoleSender();

    Bukkit.dispatchCommand(console, "lp creategroup " + name);
    task.wait(1)
    Bukkit.dispatchCommand(console, "lp group " + name + " setweight " + weight);
  });

  log.info("Grup " + name + " weight " + weight);
}

function removeGroup(name) {
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

return {
  addGroup: addGroup,
  removeGroup: removeGroup
};
