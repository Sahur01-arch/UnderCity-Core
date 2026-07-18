//!waitForInit
const Bukkit = importClass("org.bukkit.Bukkit");

log.info("Init Startup.....")

// Plugin init
task.waitForPlugin("LuckPerms")
log.info("Depedency Loaded!")

// Library init
task.thread(function() {
  task.wait(1)

  try {
    LoadScript("libs/libluckperms.js");
    LoadScript("libs/libkelas.js");
    LoadScript("libs/libtugas.js");
    LoadScript("libs/libclass.js");
    LoadScript("libs/libeventschool.js");
    LoadScript("libs/libreportcard.js");
    LoadScript("handler/command.js");
    log.info("&l&aAll modules loaded successfully.");
  } catch (e) {
    log.error("Error loading modules: " + e);
  }
})

log.info("System Success startup!!")

task.bindToUnload(function() {
  log.info("[System] : Unloaded Script...")
  UnloadScript("libs/libkelas.js")
  UnloadScript("libs/libluckperms.js")
  UnloadScript("libs/libtugas.js")
  UnloadScript("libs/libclass.js")
  UnloadScript("libs/libeventschool.js")
  UnloadScript("libs/libreportcard.js")
  UnloadScript("handler/command.js")
})
