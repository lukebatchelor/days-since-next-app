-- CreateTable
CREATE TABLE "Tracker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Checkin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tracker_id" INTEGER NOT NULL,
    "checkin_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("tracker_id") REFERENCES "Tracker" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
