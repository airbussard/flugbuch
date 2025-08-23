'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Shield, Lock, Key, Database, Cloud, CheckCircle, AlertTriangle, UserCheck, Globe } from 'lucide-react'
import Footer from '@/components/layout/Footer'

const translations = {
  en: {
    title: "Security & Privacy",
    subtitle: "Your data is safe with us. We use state-of-the-art security standards to protect your personal information and flight data.",
    
    // Security Overview Cards
    encryption: {
      title: "End-to-End Encryption",
      description: "All data transmissions are encrypted with TLS 1.3. Your data is fully protected during transmission."
    },
    authentication: {
      title: "Secure Authentication", 
      description: "Multi-factor authentication and secure session management protect your account from unauthorized access."
    },
    isolation: {
      title: "Data Isolation",
      description: "Row-Level Security ensures that only you can access your own data."
    },
    
    // Detailed Security Section
    detailedTitle: "Our Security Measures in Detail",
    dataEncryption: {
      title: "Data Encryption",
      items: [
        "TLS 1.3 encryption for all data transmissions",
        "Encrypted data storage in cloud infrastructure",
        "Secure API communication with JWT token authentication"
      ]
    },
    accessControls: {
      title: "Access Controls",
      items: [
        "Row-Level Security (RLS) for strict data isolation between users",
        "Role-based access control (RBAC) for administrative functions",
        "Automatic session timeouts on inactivity"
      ]
    },
    infrastructure: {
      title: "Infrastructure Security",
      items: [
        "Hosting in ISO 27001 certified data centers",
        "Regular automatic backups with point-in-time recovery",
        "DDoS protection and Web Application Firewall (WAF)"
      ]
    },
    application: {
      title: "Application Security",
      items: [
        "Parameterized SQL queries to prevent SQL injection",
        "Input validation and sanitization of all user inputs",
        "Content Security Policy (CSP) to protect against XSS attacks"
      ]
    },
    
    // Data Protection Principles
    principlesTitle: "Data Protection Principles",
    dataMinimization: {
      title: "Data Minimization",
      description: "We only collect data that is necessary for operating the service."
    },
    dataSovereignty: {
      title: "Data Sovereignty", 
      description: "You retain full control over your data and can export or delete it at any time."
    },
    transparency: {
      title: "Transparency",
      description: "Complete transparency about the processing of your data in accordance with GDPR."
    },
    purposeLimitation: {
      title: "Purpose Limitation",
      description: "Your data is used exclusively for the stated purpose."
    },
    
    // Compliance
    complianceTitle: "Compliance & Standards",
    standards: {
      title: "We comply with the following standards:",
      items: [
        "GDPR compliant",
        "ISO 27001 standards",
        "SOC 2 Type II compliance",
        "OWASP Security Guidelines"
      ]
    },
    audits: {
      title: "Regular reviews:",
      items: [
        "Annual security audits",
        "Penetration testing",
        "Code reviews",
        "Vulnerability scanning"
      ]
    },
    
    // Security Incidents
    incidentTitle: "Security Incidents",
    incidentDescription: "In the unlikely event of a security incident:",
    incidentItems: [
      "Immediate notification of affected users within 72 hours",
      "Transparent communication about the nature and scope of the incident",
      "Immediate initiation of countermeasures",
      "Complete documentation and reporting to supervisory authorities"
    ]
  },
  
  de: {
    title: "Sicherheit & Datenschutz",
    subtitle: "Ihre Daten sind bei uns sicher. Wir setzen modernste Sicherheitsstandards ein, um Ihre persönlichen Informationen und Flugdaten zu schützen.",
    
    // Security Overview Cards  
    encryption: {
      title: "Ende-zu-Ende Verschlüsselung",
      description: "Alle Datenübertragungen sind mit TLS 1.3 verschlüsselt. Ihre Daten sind während der Übertragung vollständig geschützt."
    },
    authentication: {
      title: "Sichere Authentifizierung",
      description: "Multi-Faktor-Authentifizierung und sichere Session-Verwaltung schützen Ihr Konto vor unbefugtem Zugriff."
    },
    isolation: {
      title: "Datenisolierung",
      description: "Row-Level Security stellt sicher, dass nur Sie auf Ihre eigenen Daten zugreifen können."
    },
    
    // Detailed Security Section
    detailedTitle: "Unsere Sicherheitsmaßnahmen im Detail",
    dataEncryption: {
      title: "Datenverschlüsselung",
      items: [
        "TLS 1.3 Verschlüsselung für alle Datenübertragungen",
        "Verschlüsselte Datenspeicherung in der Cloud-Infrastruktur",
        "Sichere API-Kommunikation mit JWT-Token-Authentifizierung"
      ]
    },
    accessControls: {
      title: "Zugriffskontrollen",
      items: [
        "Row-Level Security (RLS) für strikte Datenisolierung zwischen Benutzern",
        "Rollenbasierte Zugriffskontrolle (RBAC) für administrative Funktionen",
        "Automatische Session-Timeouts bei Inaktivität"
      ]
    },
    infrastructure: {
      title: "Infrastruktur-Sicherheit",
      items: [
        "Hosting in ISO 27001 zertifizierten Rechenzentren",
        "Regelmäßige automatische Backups mit Point-in-Time Recovery",
        "DDoS-Schutz und Web Application Firewall (WAF)"
      ]
    },
    application: {
      title: "Anwendungssicherheit",
      items: [
        "Parameterisierte SQL-Abfragen zum Schutz vor SQL-Injection",
        "Input-Validierung und Sanitization aller Benutzereingaben",
        "Content Security Policy (CSP) zum Schutz vor XSS-Angriffen"
      ]
    },
    
    // Data Protection Principles
    principlesTitle: "Datenschutzgrundsätze",
    dataMinimization: {
      title: "Datensparsamkeit",
      description: "Wir erheben nur die Daten, die für den Betrieb des Dienstes notwendig sind."
    },
    dataSovereignty: {
      title: "Datenhoheit",
      description: "Sie behalten die volle Kontrolle über Ihre Daten und können diese jederzeit exportieren oder löschen."
    },
    transparency: {
      title: "Transparenz",
      description: "Vollständige Transparenz über die Verarbeitung Ihrer Daten gemäß DSGVO."
    },
    purposeLimitation: {
      title: "Zweckbindung",
      description: "Ihre Daten werden ausschließlich für den angegebenen Zweck verwendet."
    },
    
    // Compliance
    complianceTitle: "Compliance & Standards",
    standards: {
      title: "Wir erfüllen folgende Standards:",
      items: [
        "DSGVO / GDPR konform",
        "ISO 27001 Standards",
        "SOC 2 Type II Compliance",
        "OWASP Security Guidelines"
      ]
    },
    audits: {
      title: "Regelmäßige Überprüfungen:",
      items: [
        "Jährliche Sicherheitsaudits",
        "Penetrationstests",
        "Code-Reviews",
        "Vulnerability Scanning"
      ]
    },
    
    // Security Incidents
    incidentTitle: "Sicherheitsvorfälle",
    incidentDescription: "Im unwahrscheinlichen Fall eines Sicherheitsvorfalls:",
    incidentItems: [
      "Sofortige Benachrichtigung betroffener Nutzer innerhalb von 72 Stunden",
      "Transparente Kommunikation über Art und Umfang des Vorfalls",
      "Umgehende Einleitung von Gegenmaßnahmen",
      "Vollständige Dokumentation und Meldung an Aufsichtsbehörden"
    ]
  }
}

export default function SecurityPage() {
  const [language, setLanguage] = useState<'en' | 'de'>('en')
  const t = translations[language]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="Log-K Logo" 
                width={40} 
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900">Log-K</span>
            </Link>
            
            {/* Language Switcher */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition ${
                  language === 'en' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>EN</span>
              </button>
              <button
                onClick={() => setLanguage('de')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition ${
                  language === 'de' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>DE</span>
              </button>
              <Link 
                href="/login" 
                className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-violet-600 transition font-medium"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Security Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <Lock className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t.encryption.title}
            </h3>
            <p className="text-gray-600">
              {t.encryption.description}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <Key className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t.authentication.title}
            </h3>
            <p className="text-gray-600">
              {t.authentication.description}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <Database className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t.isolation.title}
            </h3>
            <p className="text-gray-600">
              {t.isolation.description}
            </p>
          </div>
        </div>

        {/* Detailed Security Measures */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t.detailedTitle}
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.dataEncryption.title}
              </h3>
              <ul className="space-y-2 text-gray-600">
                {t.dataEncryption.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.accessControls.title}
              </h3>
              <ul className="space-y-2 text-gray-600">
                {t.accessControls.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.infrastructure.title}
              </h3>
              <ul className="space-y-2 text-gray-600">
                {t.infrastructure.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.application.title}
              </h3>
              <ul className="space-y-2 text-gray-600">
                {t.application.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Data Protection Principles */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t.principlesTitle}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <UserCheck className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t.dataMinimization.title}
                </h3>
                <p className="text-gray-600">
                  {t.dataMinimization.description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Cloud className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t.dataSovereignty.title}
                </h3>
                <p className="text-gray-600">
                  {t.dataSovereignty.description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t.transparency.title}
                </h3>
                <p className="text-gray-600">
                  {t.transparency.description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Lock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t.purposeLimitation.title}
                </h3>
                <p className="text-gray-600">
                  {t.purposeLimitation.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-blue-50 rounded-xl p-8 border border-blue-200 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t.complianceTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                {t.standards.title}
              </h3>
              <ul className="space-y-2 text-gray-700">
                {t.standards.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                {t.audits.title}
              </h3>
              <ul className="space-y-2 text-gray-700">
                {t.audits.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Security Incident Response */}
        <div className="bg-amber-50 rounded-xl p-8 border border-amber-200">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {t.incidentTitle}
              </h2>
              <p className="text-gray-700 mb-4">
                {t.incidentDescription}
              </p>
              <ul className="space-y-2 text-gray-700">
                {t.incidentItems.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}