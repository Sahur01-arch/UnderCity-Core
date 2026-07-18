//!waitForInit
const Bukkit = importClass("org.bukkit.Bukkit");

log.info("[System] Initializing startup sequence...");

// 1. Wait for required plugins
task.waitForPlugin("LuckPerms");
log.info("[System] Dependencies loaded.");

// 2. Perform loading in a dedicated thread to avoid blocking main thread
task.thread(function() {
    task.wait(1); // ADDED: Delay to allow initialization to finish
    log.info("[System] Starting module loading...");

    const scriptsToLoad = [
        "libs/libluckperms.js",
        "libs/libkelas.js",
        "libs/libtugas.js",
        "libs/libclass.js",
        "libs/libeventschool.js",
        "libs/libreportcard.js",
        "handler/command.js"
    ];

    for (var i = 0; i < scriptsToLoad.length; i++) {
        var scriptPath = scriptsToLoad[i];
        try {
            LoadScript(scriptPath);
            log.info("[System] Successfully loaded: " + scriptPath);
        } catch (e) {
            log.error("[System] Failed to load " + scriptPath + ": " + e);
        }
    }

    log.info("[System] All modules initialized successfully.");
});

task.bindToUnload(function() {
    log.info("[System] Unloading modules...");
    // Unload in reverse order
    UnloadScript("handler/command.js");
    UnloadScript("libs/libreportcard.js");
    UnloadScript("libs/libeventschool.js");
    UnloadScript("libs/libclass.js");
    UnloadScript("libs/libtugas.js");
    UnloadScript("libs/libkelas.js");
    UnloadScript("libs/libluckperms.js");
    log.info("[System] Cleanup complete.");
});
