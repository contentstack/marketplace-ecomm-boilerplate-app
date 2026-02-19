const { openAllCollectedLinks, clearCollectedLinks } = require("../utils");

(async () => {
  try {
    // Open all collected links
    openAllCollectedLinks();

    clearCollectedLinks();
  } catch (error) {
    console.error("Error opening collected links:");
    console.error(error.message || error);
  }
})();
