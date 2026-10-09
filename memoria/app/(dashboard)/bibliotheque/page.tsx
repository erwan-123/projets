// app/(dashboard)/bibliotheque/page.tsx
"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface SujetArchive {
  id: string
  title: string
  description: string
  keywords: string[]
  domain: { name: string; color: string } | null
  proposer: { name: string }
  createdAt: string
  viewCount?: number
}

export default function BibliothequePage() {
  const [sujets, setSujets] = useState<SujetArchive[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [domains, setDomains] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    axios
      .get('/api/sujets?status=APPROVED&isPublic=true')
      .then(({ data }) => setSujets(data))
      .catch((error) => console.error('Erreur', error))
      .finally(() => setLoading(false))
    axios
      .get('/api/domains')
      .then(({ data }) => setDomains(data))
      .catch((error) => console.error('Erreur', error))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedDomain) params.append('domain', selectedDomain)
      params.append('status', 'APPROVED')
      params.append('isPublic', 'true')
      axios
        .get(`/api/sujets?${params.toString()}`)
        .then(({ data }) => setSujets(data))
        .catch((error) => console.error('Erreur', error))
    }, 300)
    return () => clearTimeout(timer)
  }, [search, selectedDomain])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          📚 Bibliothèque des sujets
        </h1>
        <p className="text-gray-600 mt-1">
          Explorez les sujets de mémoire approuvés
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un sujet..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les domaines</option>
          {domains.map((domain) => (
            <option key={domain.id} value={domain.id}>
              {domain.name}
            </option>
          ))}
        </select>
        <Button variant="secondary" onClick={() => {
          setSearch('')
          setSelectedDomain('')
        }}>
          Réinitialiser
        </Button>
      </div>

      {sujets.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900">
              Aucun sujet trouvé
            </h3>
            <p className="text-gray-500 mt-2">
              Essayez de modifier vos filtres de recherche
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sujets.map((sujet) => (
            <Card key={sujet.id}>
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {sujet.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {sujet.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {sujet.domain && (
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: sujet.domain.color + '20',
                        color: sujet.domain.color,
                      }}
                    >
                      {sujet.domain.name}
                    </span>
                  )}
                  {sujet.keywords.slice(0, 3).map((keyword) => (
                    <Badge key={keyword} variant="info">
                      {keyword}
                    </Badge>
                  ))}
                  {sujet.keywords.length > 3 && (
                    <Badge variant="default">
                      +{sujet.keywords.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>👤 {sujet.proposer.name}</span>
                  <span>📅 {new Date(sujet.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                {sujet.viewCount && (
                  <div className="mt-2 text-xs text-gray-400">
                    👁️ {sujet.viewCount} consultations
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}