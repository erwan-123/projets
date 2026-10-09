import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  // 👇 SECTION OBLIGATOIRE pour Prisma 8
  orm: {
    target: "sqlite", // Utilisation de SQLite (pas besoin de serveur)
  },
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});