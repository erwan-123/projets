// app/dashboard/page.tsx
"use client"

import { useSession, signOut } from "next-auth/react"
import { redirect } from "next/navigation"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  // Si le chargement des données de session est en cours
  if (status === "loading") {
    return <div className="text-center p-8">Chargement...</div>
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers login
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Bienvenue, {session.user?.name || "Utilisateur"}
        </h1>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-gray-500 text-sm font-medium">Mémoire en cours</h3>
          <p className="text-3xl font-bold mt-2">1</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-gray-500 text-sm font-medium">Avancement</h3>
          <p className="text-3xl font-bold mt-2">45%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-gray-500 text-sm font-medium">Notifications</h3>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Dernières activités</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <span>📝 Mémoire &quot;Impact de l&apos;IA&quot; mis à jour</span>
            <span className="text-sm text-gray-500">Il y a 2 heures</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span>✅ Section &quot;Introduction&quot; validée</span>
            <span className="text-sm text-gray-500">Il y a 5 heures</span>
          </div>
          <div className="flex items-center justify-between">
            <span>🔔 Nouveau commentaire de l&apos;encadrant</span>
            <span className="text-sm text-gray-500">Hier</span>
          </div>
        </div>
      </div>
    </div>
  )
}