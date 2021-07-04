-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tracker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "expiry_days" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Tracker" ("id", "name") SELECT "id", "name" FROM "Tracker";
DROP TABLE "Tracker";
ALTER TABLE "new_Tracker" RENAME TO "Tracker";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
