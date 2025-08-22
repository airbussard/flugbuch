# Migration Plan: CSV zu SQL Tabellen

## Übersicht
Migration der Airport/Runway/Frequency Daten von CSV-Dateien zu Supabase SQL-Tabellen zur Lösung von Berechtigungsproblemen und Verbesserung der Zuverlässigkeit.

## Zeitaufwand: 15-20 Stunden

## Phase 1: Datenbank-Setup (3-4 Stunden)

### SQL Tabellen erstellen:
```sql
-- Airports Tabelle
CREATE TABLE airports (
  icao VARCHAR(4) PRIMARY KEY,
  iata VARCHAR(3),
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  country VARCHAR(2),
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  elevation INTEGER,
  timezone VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Runways Tabelle
CREATE TABLE runways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airport_icao VARCHAR(4) REFERENCES airports(icao) ON DELETE CASCADE,
  runway_id VARCHAR(10) NOT NULL,
  length_ft INTEGER,
  width_ft INTEGER,
  surface VARCHAR(50),
  heading INTEGER,
  ils BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Frequencies Tabelle
CREATE TABLE frequencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airport_icao VARCHAR(4) REFERENCES airports(icao) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  frequency DECIMAL(6, 3) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies:
- Alle Benutzer können lesen
- Nur authentifizierte Benutzer können schreiben
- Admin-Rolle für erweiterte Berechtigungen

## Phase 2: Import-Tool (4-5 Stunden)

### Admin-Bereich Import-Funktion:
```typescript
// /app/admin/airports/import/page.tsx
- CSV Upload Interface
- Validierung der Daten
- Batch-Import mit Fortschrittsanzeige
- Fehlerbehandlung und Rollback

// /app/api/admin/airports/import/route.ts
- CSV Parsing
- Datenvalidierung
- Transaktionale Imports
- Konfliktauflösung (Update vs. Insert)
```

## Phase 3: Service Layer Anpassung (3-4 Stunden)

### Airport Service umbauen:
```typescript
// /lib/services/airport-service.ts
class AirportService {
  // Von CSV zu Supabase wechseln
  async getAirport(icao: string) {
    const { data } = await supabase
      .from('airports')
      .select(`
        *,
        runways (*),
        frequencies (*)
      `)
      .eq('icao', icao)
      .single()
    return data
  }
  
  // Cache-Layer optional beibehalten für Performance
  private cache = new Map()
  
  // CRUD Operationen direkt auf Supabase
  async updateAirport(icao: string, data: AirportData) {
    const { data: updated } = await supabase
      .from('airports')
      .update(data)
      .eq('icao', icao)
      .select()
      .single()
    
    this.cache.delete(icao)
    return updated
  }
}
```

## Phase 4: Frontend Anpassung (2-3 Stunden)

### Components Update:
- AirportSelector: Supabase-Abfragen statt Service
- AirportEditor: Direkte DB-Updates
- Admin-Panel: Neue Import-UI

### Real-time Updates (optional):
```typescript
// Supabase Subscriptions für Live-Updates
supabase
  .channel('airports-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'airports'
  }, handleAirportChange)
  .subscribe()
```

## Phase 5: Migration & Testing (3-4 Stunden)

### Datenmigration:
1. Backup der CSV-Dateien
2. Import-Script für bestehende Daten
3. Validierung der migrierten Daten
4. Parallel-Betrieb für Übergangsphase

### Testing:
- Unit Tests für neue Services
- Integration Tests für API
- E2E Tests für kritische Flows
- Performance-Vergleich

## Vorteile der Migration

### Gelöste Probleme:
✅ Keine Dateisystem-Berechtigungsprobleme mehr
✅ Transaktionale Updates (ACID)
✅ Bessere Concurrency-Kontrolle
✅ Audit-Trail (wer hat wann was geändert)
✅ Backup durch Supabase

### Neue Möglichkeiten:
- Real-time Updates für alle Nutzer
- Erweiterte Suchfunktionen (SQL Queries)
- Versionierung möglich
- Batch-Updates vereinfacht
- API-basierter Zugriff

## Kompatibilität

### PIREP System:
✅ Funktioniert weiterhin - nutzt nur ICAO-Codes
✅ Kann von besserer Datenqualität profitieren

### Flight Import:
✅ Keine Änderungen nötig - nutzt Airport Service

### Statistics:
✅ Profitiert von SQL-Abfragen für Aggregationen

## Implementierungs-Reihenfolge

1. **Woche 1:**
   - Datenbank-Schema erstellen
   - Import-Tool entwickeln
   - Erste Test-Imports

2. **Woche 2:**
   - Service Layer umbauen
   - Frontend anpassen
   - Testing & Bugfixes

3. **Woche 3:**
   - Produktions-Migration
   - Monitoring
   - Performance-Optimierung

## Fallback-Plan

Falls Probleme auftreten:
1. CSV-Dateien als Backup behalten
2. Feature-Flag für Umschaltung CSV/SQL
3. Schrittweise Migration (erst Read-Only, dann Write)
4. Rollback-Script vorbereiten

## Notizen

- Die Migration löst die Berechtigungsprobleme dauerhaft
- Performance sollte durch Datenbank-Indizes besser werden
- Wartbarkeit wird deutlich erhöht
- Skalierbarkeit für zukünftige Features gegeben

---

**Status:** Geplant, noch nicht implementiert
**Geschätzter Aufwand:** 15-20 Stunden
**Priorität:** Mittel-Hoch (löst aktuelle Probleme mit Admin-Bearbeitung)