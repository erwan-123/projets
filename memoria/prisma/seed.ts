// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Création des données de test...')

  // 1. Créer l'administrateur
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@memoire.com' },
    update: {},
    create: {
      email: 'admin@memoire.com',
      password: adminPassword,
      name: 'Administrateur',
      role: 'ADMIN',
    },
  })
  console.log(`✅ Admin prêt: ${admin.email}`)

  // 2. Créer un encadrant
  const supervisorPassword = await hash('super123', 12)
  const supervisor = await prisma.user.upsert({
    where: { email: 'dr.martin@memoire.com' },
    update: {},
    create: {
      email: 'dr.martin@memoire.com',
      password: supervisorPassword,
      name: 'Dr. Jean Martin',
      role: 'SUPERVISOR',
    },
  })
  console.log(`✅ Encadrant prêt: ${supervisor.email}`)

  // 3. Créer un étudiant
  const studentPassword = await hash('student123', 12)
  const student = await prisma.user.upsert({
    where: { email: 'etudiant@memoire.com' },
    update: {},
    create: {
      email: 'etudiant@memoire.com',
      password: studentPassword,
      name: 'Kouadio Jean',
      role: 'STUDENT',
    },
  })
  console.log(`✅ Étudiant prêt: ${student.email}`)

  // 4. Créer un mémoire pour l'étudiant (si absent)
  let memoire = await prisma.memoire.findFirst({
    where: { etudiantId: student.id },
  })
  if (!memoire) {
    memoire = await prisma.memoire.create({
      data: {
        title: "Impact de l'Intelligence Artificielle sur l'éducation",
        abstract: "Cette étude examine comment l'IA transforme les méthodes d'apprentissage...",
        status: 'IN_PROGRESS',
        progress: 45,
        etudiantId: student.id,
      },
    })
    console.log(`✅ Mémoire créé: ${memoire.title}`)
  } else {
    console.log(`✅ Mémoire existant: ${memoire.title}`)
  }

  // 5. Créer des sections pour ce mémoire (si absentes)
  const sectionCount = await prisma.section.count({
    where: { memoireId: memoire.id },
  })
  if (sectionCount === 0) {
    await prisma.section.createMany({
      data: [
        {
          title: 'Introduction',
          content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: "Contenu de l'introduction..." }] }] },
          position: 0,
          status: 'COMPLETED',
          memoireId: memoire.id,
        },
        {
          title: 'Revue de littérature',
          content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Contenu de la revue de littérature...' }] }] },
          position: 1,
          status: 'IN_PROGRESS',
          memoireId: memoire.id,
        },
        {
          title: 'Méthodologie',
          content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Contenu de la méthodologie...' }] }] },
          position: 2,
          status: 'DRAFT',
          memoireId: memoire.id,
        },
      ],
    })
    console.log('✅ Sections créées')
  } else {
    console.log('✅ Sections existantes')
  }

  console.log('\n📝 Comptes de test :')
  console.log('  Admin    : admin@memoire.com / admin123')
  console.log('  Encadrant: dr.martin@memoire.com / super123')
  console.log('  Étudiant : etudiant@memoire.com / student123')
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })