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
  log.info("&l&alibluckperms.js dimuat.");

  LoadScript("libs/libkelas.js")
  log.info("&l&alibkelas.js dimuat.")

  LoadScript("libs/libtugas.js")
  log.info("&l&alibtugas.js dimuat.")

  LoadScript("handler/command.js")
  log.info("&l&acommand.js dimuat.")
})

log.info("System Success startup!!")

task.bindToUnload(function() {
  log.info("[System] : Unloaded Script...")
  UnloadScript("libs/libkelas.js")
  UnloadScript("libs/libluckperms.js")
  UnloadScript("libs/libtugas.js")
  UnloadScript("handler/command.js")
})
