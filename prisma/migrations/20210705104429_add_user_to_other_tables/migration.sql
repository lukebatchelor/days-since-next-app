/*
  Warnings:

  - Added the required column `userId` to the `Checkin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Tracker` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Checkin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "tracker_id" INTEGER NOT NULL,
    "checkin_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("tracker_id") REFERENCES "Tracker" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Checkin" ("checkin_date", "id", "tracker_id") SELECT "checkin_date", "id", "tracker_id" FROM "Checkin";
DROP TABLE "Checkin";
ALTER TABLE "new_Checkin" RENAME TO "Checkin";
CREATE TABLE "new_Tracker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expiry_days" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tracker" ("expiry_days", "id", "name") SELECT "expiry_days", "id", "name" FROM "Tracker";
DROP TABLE "Tracker";
ALTER TABLE "new_Tracker" RENAME TO "Tracker";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
