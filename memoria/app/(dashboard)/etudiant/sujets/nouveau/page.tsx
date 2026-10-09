// app/(dashboard)/etudiant/sujets/nouveau/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

// Schéma de validation
const sujetSchema = z.object({
  title: z.string()
    .min(10, "Le titre doit faire au moins 10 caractères")
    .max(200, "Le titre est trop long"),
  description: z.string()
    .min(50, "La description doit faire au moins 50 caractères")
    .max(5000, "La description est trop longue"),
  domain: z.string().min(1, "Veuillez sélectionner un domaine"),
  keywords: z.string()
    .min(3, "Ajoutez au moins un mot-clé")
    .max(200, "Trop de mots-clés"),
  problematique: z.string()
    .min(30, "La problématique doit faire au moins 30 caractères"),
  objectives: z.string()
    .min(30, "Les objectifs doivent faire au moins 30 caractères"),
  methodology: z.string()
    .min(30, "La méthodologie doit faire au moins 30 caractères"),
})

type FormData = z.infer<typeof sujetSchema>

// Étapes du questionnaire
const STEPS = [
  { id: 1, title: "Thème et Domaine", icon: "🎯" },
  { id: 2, title: "Problématique", icon: "❓" },
  { id: 3, title: "Objectifs", icon: "📌" },
  { id: 4, title: "Méthodologie", icon: "🔬" },
  { id: 5, title: "Synthèse", icon: "📋" },
]

export default function NouveauSujetPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [domains, setDomains] = useState<{ id: string; name: string; color: string }[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors }, setValue, getValues } = useForm<FormData>({
    resolver: zodResolver(sujetSchema),
    defaultValues: {
      title: '',
      description: '',
      domain: '',
      keywords: '',
      problematique: '',
      objectives: '',
      methodology: '',
    }
  })

  // Récupérer les domaines
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const { data } = await axios.get('/api/domains')
        setDomains(data)
      } catch (error) {
        console.error('Erreur lors du chargement des domaines', error)
      }
    }
    fetchDomains()
  }, [])

  // Suggestion de mots-clés
  // eslint-disable-next-line react-hooks/incompatible-library
  const title = watch('title')
  // eslint-disable-next-line react-hooks/incompatible-library
  const description = watch('description')

  useEffect(() => {
    const getSuggestions = async () => {
      if (title.length > 5 || description.length > 20) {
        setSuggestionsLoading(true)
        try {
          const { data } = await axios.get('/api/sujets/suggestions', {
            params: { title, description }
          })
          setSuggestions(data)
        } catch (error) {
          console.error('Erreur', error)
        } finally {
          setSuggestionsLoading(false)
        }
      }
    }
    const timer = setTimeout(getSuggestions, 500)
    return () => clearTimeout(timer)
  }, [title, description])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        keywords: data.keywords.split(',').map(k => k.trim()),
      }
      await axios.post('/api/sujets', payload)
      router.push('/etudiant/sujets')
    } catch (error) {
      console.error('Erreur lors de la soumission', error)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < 5) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Titre de votre sujet *
              </label>
              <input
                {...register('title')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Impact de l'IA sur l'apprentissage..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestionsLoading && (
                  <span className="text-sm text-gray-500">Recherche de suggestions...</span>
                )}
                {suggestions.map((s, i) => (
                  <Badge
                    key={i}
                    variant="info"
                    className="cursor-pointer hover:bg-blue-200"
                    onClick={() => setValue('title', s)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Domaine d&apos;étude *
              </label>
              <select
                {...register('domain')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un domaine</option>
                {domains.map(domain => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name}
                  </option>
                ))}
              </select>
              {errors.domain && (
                <p className="mt-1 text-sm text-red-600">{errors.domain.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description du sujet *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez votre sujet en détail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mots-clés *
              </label>
              <input
                {...register('keywords')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="IA, apprentissage, éducation, ..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Séparez les mots-clés par des virgules
              </p>
              {errors.keywords && (
                <p className="mt-1 text-sm text-red-600">{errors.keywords.message}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Problématique *
              </label>
              <textarea
                {...register('problematique')}
                rows={5}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Quelle est la question principale que votre recherche cherche à répondre ?"
              />
              {errors.problematique && (
                <p className="mt-1 text-sm text-red-600">{errors.problematique.message}</p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Objectifs de recherche *
              </label>
              <textarea
                {...register('objectives')}
                rows={5}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Quels sont les objectifs spécifiques de votre recherche ?"
              />
              {errors.objectives && (
                <p className="mt-1 text-sm text-red-600">{errors.objectives.message}</p>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Méthodologie proposée *
              </label>
              <textarea
                {...register('methodology')}
                rows={5}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Comment allez-vous mener votre recherche ?"
              />
              {errors.methodology && (
                <p className="mt-1 text-sm text-red-600">{errors.methodology.message}</p>
              )}
            </div>
          </div>
        )

      case 5:
        const values = getValues()
        const keywordsList = values.keywords ? values.keywords.split(',').map(k => k.trim()).filter(Boolean) : []
        const selectedDomain = domains.find(d => d.id === values.domain)

        return (
          <div className="space-y-4">
            <Card title="Synthèse de votre proposition">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Titre</h4>
                  <p className="text-gray-900">{values.title || 'Non renseigné'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Domaine</h4>
                  <p className="text-gray-900">{selectedDomain?.name || 'Non sélectionné'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Mots-clés</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {keywordsList.length > 0 ? (
                      keywordsList.map((k, i) => (
                        <Badge key={i} variant="info">{k}</Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">Aucun</span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Problématique</h4>
                  <p className="text-gray-700 text-sm">{values.problematique || 'Non renseigné'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Objectifs</h4>
                  <p className="text-gray-700 text-sm">{values.objectives || 'Non renseigné'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Méthodologie</h4>
                  <p className="text-gray-700 text-sm">{values.methodology || 'Non renseigné'}</p>
                </div>
              </div>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          📝 Proposer un sujet de mémoire
        </h1>
        <p className="text-gray-600 mt-1">
          Remplissez ce questionnaire pour soumettre votre proposition
        </p>
      </div>

      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1">
              <div className="flex items-center">
                <div className={`
                  flex-1 h-2 
                  ${i + 1 <= step ? 'bg-blue-600' : 'bg-gray-200'}
                  ${i === 0 ? 'rounded-l-full' : ''}
                  ${i === STEPS.length - 1 ? 'rounded-r-full' : ''}
                `} />
                {i < STEPS.length - 1 && (
                  <div className="w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center -ml-4">
                    <span className={`text-sm ${i + 1 <= step ? 'text-blue-600' : 'text-gray-400'}`}>
                      {s.icon}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-1">
                <span className={`text-xs ${i + 1 <= step ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <div className="space-y-6">
          {renderStep()}

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="secondary"
              onClick={prevStep}
              disabled={step === 1}
            >
              ← Précédent
            </Button>

            {step < 5 ? (
              <Button
                variant="primary"
                onClick={nextStep}
              >
                Suivant →
              </Button>
            ) : (
              <Button
                variant="success"
                loading={loading}
                onClick={handleSubmit(onSubmit)}
              >
                📤 Soumettre la proposition
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}