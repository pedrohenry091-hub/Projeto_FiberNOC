-- CreateTable
CREATE TABLE "Onu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "mac" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sinal" REAL NOT NULL,
    "regiao" TEXT NOT NULL,
    "olt" TEXT NOT NULL,
    "pon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" TEXT NOT NULL,
    "onu" TEXT NOT NULL,
    "evento" TEXT NOT NULL,
    "detalhe" TEXT NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Onu_mac_key" ON "Onu"("mac");
