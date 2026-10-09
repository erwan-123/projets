// app/api/sujets/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const title = searchParams.get('title') || ''
  const description = searchParams.get('description') || ''

  try {
    // 1. Recherche par mots-clés dans les sujets existants
    const existingSubjects = await prisma.sujet.findMany({
      where: {
        OR: [
          { title: { contains: title } },
          { description: { contains: description } },
        ],
        status: 'APPROVED',
      },
      take: 5,
      select: { title: true },
    })

    const titles = existingSubjects.map(s => s.title)

    // 2. Suggestions basées sur des règles métier
    const ruleBasedSuggestions = generateRuleBasedSuggestions(title, description)

    // 3. Combiner et dédoublonner
    const allSuggestions = [...titles, ...ruleBasedSuggestions]
    const uniqueSuggestions = [...new Set(allSuggestions)]

    return NextResponse.json(uniqueSuggestions.slice(0, 10))
  } catch (error) {
    console.error('Erreur suggestions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération des suggestions' },
      { status: 500 }
    )
  }
}

function generateRuleBasedSuggestions(title: string, description: string): string[] {
  const suggestions: string[] = []
  const lowerTitle = title.toLowerCase()
  const lowerDesc = description.toLowerCase()

  const keywords = [
    { word: 'ia', suggestion: 'Impact de l\'Intelligence Artificielle sur...' },
    { word: 'apprentissage', suggestion: 'Stratégies d\'apprentissage innovantes pour...' },
    { word: 'éducation', suggestion: 'Rôle de l\'éducation dans le développement...' },
    { word: 'digital', suggestion: 'Transformation digitale des services...' },
    { word: 'environnement', suggestion: 'Gestion durable de l\'environnement...' },
  ]

  for (const { word, suggestion } of keywords) {
    if (lowerTitle.includes(word) || lowerDesc.includes(word)) {
      suggestions.push(suggestion)
    }
  }

  return suggestions
}