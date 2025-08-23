'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission is disabled
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Kontakt
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Wir freuen uns auf Ihre Nachricht
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Kontaktinformationen
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">E-Mail</p>
                    <p className="text-gray-600 dark:text-gray-400">support@log-k.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Telefon</p>
                    <p className="text-gray-600 dark:text-gray-400">+49 (0) 123 456789</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Adresse</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Log-K GmbH<br />
                      Musterstraße 123<br />
                      12345 Musterstadt<br />
                      Deutschland
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Support-Zeiten:</strong><br />
                  Montag - Freitag: 9:00 - 18:00 Uhr<br />
                  Samstag: 10:00 - 14:00 Uhr
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Kontaktformular
              </h2>

              <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Hinweis:</strong> Das Kontaktformular wird derzeit überarbeitet und ist vorübergehend deaktiviert. 
                  Bitte kontaktieren Sie uns per E-Mail an support@log-k.com.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white opacity-60 cursor-not-allowed"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white opacity-60 cursor-not-allowed"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Betreff *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white opacity-60 cursor-not-allowed"
                    required
                  >
                    <option value="">Bitte wählen...</option>
                    <option value="general">Allgemeine Anfrage</option>
                    <option value="support">Technischer Support</option>
                    <option value="billing">Abrechnung & Abonnements</option>
                    <option value="feature">Feature-Anfrage</option>
                    <option value="bug">Fehlermeldung</option>
                    <option value="other">Sonstiges</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white opacity-60 cursor-not-allowed resize-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    * Pflichtfelder
                  </p>
                  <button
                    type="submit"
                    disabled
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-400 text-white font-medium rounded-lg cursor-not-allowed opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    Nachricht senden
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}