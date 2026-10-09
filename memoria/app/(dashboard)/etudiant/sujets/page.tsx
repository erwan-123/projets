// app/(dashboard)/etudiant/sujets/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Sujet {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION' | 'VALIDATED'
  createdAt: string
  domain: { name: string; color: string } | null
  keywords: string[]
  feedback?: string
}

const statusColors: Record<Sujet['status'], 'warning' | 'success' | 'danger'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  REVISION: 'warning',
  VALIDATED: 'success',
}

const statusLabels = {
  PENDING: 'En attente',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  REVISION: 'À réviser',
  VALIDATED: 'Validé',
}

export default function MesSujetsPage() {
  const router = useRouter()
  const [sujets, setSujets] = useState<Sujet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSujets = async () => {
      try {
        const { data } = await axios.get('/api/sujets')
        setSujets(data)
      } catch (error) {
        setError('Erreur lors du chargement des sujets')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchSujets()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des sujets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            📋 Mes propositions de sujet
          </h1>
          <p className="text-gray-600 mt-1">
            {sujets.length} proposition{sujets.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push('/etudiant/sujets/nouveau')}
        >
          + Nouveau sujet
        </Button>
      </div>

      {sujets.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-900">
              Aucune proposition
            </h3>
            <p className="text-gray-500 mt-2">
              Vous n&apos;avez pas encore proposé de sujet.
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => router.push('/etudiant/sujets/nouveau')}
            >
              Proposer un sujet
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sujets.map((sujet) => (
            <Card key={sujet.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {sujet.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {sujet.description}
                      </p>
                    </div>
                    <Badge variant={statusColors[sujet.status]}>
                      {statusLabels[sujet.status]}
                    </Badge>
                  </div>

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
                    {sujet.keywords.map((keyword, i) => (
                      <Badge key={i} variant="info">
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  {sujet.feedback && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">
                        💬 Retour de l&apos;encadrant :
                      </p>
                      <p className="text-sm text-yellow-700">{sujet.feedback}</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      📅 {new Date(sujet.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    {sujet.status === 'APPROVED' && (
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => router.push(`/etudiant/memoire/${sujet.id}`)}
                      >
                        Commencer la rédaction →
                      </button>
                    )}
                    {sujet.status === 'REVISION' && (
                      <button
                        className="text-orange-600 hover:text-orange-800 font-medium"
                        onClick={() => router.push(`/etudiant/sujets/${sujet.id}/reviser`)}
                      >
                        Réviser la proposition
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}