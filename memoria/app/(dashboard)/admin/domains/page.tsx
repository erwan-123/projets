// app/(dashboard)/admin/domains/page.tsx
"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Domain {
  id: string
  name: string
  description: string
  color: string
  isActive: boolean
  _count?: { subjects: number }
}

export default function DomainesPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Domain | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    isActive: true,
  })

  const fetchDomains = async () => {
    try {
      const { data } = await axios.get('/api/domains')
      setDomains(data)
    } catch (error) {
      console.error('Erreur', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    axios
      .get('/api/domains')
      .then(({ data }) => setDomains(data))
      .catch((error) => console.error('Erreur', error))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await axios.put(`/api/domains/${editing.id}`, formData)
      } else {
        await axios.post('/api/domains', formData)
      }
      fetchDomains()
      setShowForm(false)
      setEditing(null)
      resetForm()
    } catch (error) {
      console.error('Erreur', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous supprimer ce domaine ?')) return
    try {
      await axios.delete(`/api/domains/${id}`)
      fetchDomains()
    } catch (error) {
      console.error('Erreur', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      isActive: true,
    })
  }

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
  ]

if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            🏷️ Gestion des domaines
          </h1>
          <p className="text-gray-600 mt-1">
            {domains.length} domaines configurés
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setShowForm(!showForm)
            setEditing(null)
            resetForm()
          }}
        >
          {showForm ? 'Annuler' : '+ Nouveau domaine'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom du domaine *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Couleur
                </label>
                <div className="flex gap-2 mt-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-900' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                {editing ? 'Mettre à jour' : 'Créer'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false)
                  setEditing(null)
                  resetForm()
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {domains.map((domain) => (
          <Card key={domain.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: domain.color }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{domain.name}</h3>
                  <p className="text-sm text-gray-500">
                    {domain._count?.subjects || 0} sujets
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  onClick={() => {
                    setEditing(domain)
                    setFormData({
                      name: domain.name,
                      description: domain.description || '',
                      color: domain.color,
                      isActive: domain.isActive,
                    })
                    setShowForm(true)
                  }}
                >
                  ✏️
                </button>
                <button
                  className="text-red-600 hover:text-red-800 text-sm"
                  onClick={() => handleDelete(domain.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
            {domain.description && (
              <p className="mt-2 text-sm text-gray-600">{domain.description}</p>
            )}
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                domain.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {domain.isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}