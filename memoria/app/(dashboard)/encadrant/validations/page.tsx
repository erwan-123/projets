// app/(dashboard)/encadrant/validations/page.tsx
"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface SujetAValider {
  id: string
  title: string
  description: string
  problematique: string
  objectives: string
  methodology: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION'
  createdAt: string
  proposer: {
    name: string
    email: string
  }
  keywords: string[]
  domain: { name: string; color: string } | null
}

export default function ValidationsPage() {
  const [sujets, setSujets] = useState<SujetAValider[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSujet, setSelectedSujet] = useState<SujetAValider | null>(null)
  const [feedback, setFeedback] = useState('')
  const [action, setAction] = useState<'APPROVED' | 'REJECTED' | 'REVISION' | null>(null)

  const fetchSujets = async () => {
    try {
      const { data } = await axios.get('/api/sujets?status=PENDING')
      setSujets(data)
    } catch (error) {
      console.error('Erreur', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    axios
      .get('/api/sujets?status=PENDING')
      .then(({ data }) => setSujets(data))
      .catch((error) => console.error('Erreur', error))
      .finally(() => setLoading(false))
  }, [])

  const handleValidation = async (sujetId: string) => {
    if (!action) return

    try {
      await axios.post(`/api/validations/${sujetId}`, {
        status: action,
        feedback: feedback,
        step: 'SUJET',
      })

      fetchSujets()
      setSelectedSujet(null)
      setFeedback('')
      setAction(null)
    } catch (error) {
      console.error('Erreur', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        ✅ Validations des sujets
      </h1>
      <p className="text-gray-600 mb-8">
        {sujets.length} sujet(s) en attente de validation
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des sujets */}
        <div className="lg:col-span-1 space-y-4">
          {sujets.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-8">
                🎉 Aucun sujet en attente
              </p>
            </Card>
          ) : (
            sujets.map((sujet) => (
              <Card
                key={sujet.id}
                className={`cursor-pointer transition ${
                  selectedSujet?.id === sujet.id
                    ? 'border-blue-500 shadow-lg'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedSujet(sujet)}
              >
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {sujet.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {sujet.proposer.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="warning">En attente</Badge>
                  {sujet.domain && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{
                        backgroundColor: sujet.domain.color + '20',
                        color: sujet.domain.color,
                      }}
                    >
                      {sujet.domain.name}
                    </span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Détails du sujet sélectionné */}
        <div className="lg:col-span-2">
          {selectedSujet ? (
            <Card>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedSujet.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Proposé par {selectedSujet.proposer.name} • {selectedSujet.proposer.email}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Domaine</h4>
                  <div className="mt-1">
                    {selectedSujet.domain ? (
                      <span
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: selectedSujet.domain.color + '20',
                          color: selectedSujet.domain.color,
                        }}
                      >
                        {selectedSujet.domain.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">Non spécifié</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Mots-clés</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedSujet.keywords.map((keyword) => (
                      <Badge key={keyword} variant="info">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Description</h4>
                  <p className="mt-1 text-gray-600">{selectedSujet.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Problématique</h4>
                  <p className="mt-1 text-gray-600">{selectedSujet.problematique}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Objectifs</h4>
                  <p className="mt-1 text-gray-600">{selectedSujet.objectives}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Méthodologie</h4>
                  <p className="mt-1 text-gray-600">{selectedSujet.methodology}</p>
                </div>

                <div className="border-t pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Retour de validation
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Expliquez votre décision..."
                    />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="success"
                      onClick={() => {
                        setAction('APPROVED')
                        handleValidation(selectedSujet.id)
                      }}
                    >
                      ✅ Approuver
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => {
                        setAction('REVISION')
                        handleValidation(selectedSujet.id)
                      }}
                    >
                      🔄 Demander révision
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setAction('REJECTED')
                        handleValidation(selectedSujet.id)
                      }}
                    >
                      ❌ Rejeter
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">👈</div>
                <p>Sélectionnez un sujet à valider</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}