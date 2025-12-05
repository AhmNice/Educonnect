import { createTables } from "./temp.js";
(async () => {
  console.log("🚀 Running DB setup...");
  await createTables();
  console.log("🎉 Done!");
  process.exit(0);
})();