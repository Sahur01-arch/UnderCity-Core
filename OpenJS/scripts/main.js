//!waitForInit
var Bukkit = importClass("org.bukkit.Bukkit");

log.info("Init Startup.....")

// Plugin init
task.waitForPlugin("LuckPerms")
log.info("Depedency Loaded!")

// Library init
task.thread(function() {
  task.wait(1)

  LoadScript("libs/libluckperms.js");
  log.info("libluckperms.js dimuat.");

  LoadScript("libs/libkelas.js")
  log.info("libkelas.js dimuat.")

  LoadScript("handler/command.js")
  log.info("command.js dimuat.")
})

log.info("System Success startup!!")

task.bindToUnload(function() {
  log.info("[System] : Unloaded Script...")
  UnloadScript("libs/libkelas.js")
  UnloadScript("libs/libluckperms.js")
  UnloadScript("handler/command.js")
})
