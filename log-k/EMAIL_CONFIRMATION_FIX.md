# Email Confirmation Fix für Registrierung

## Problem
Die Registrierung schlägt mit einem Foreign Key Constraint Fehler fehl:
```
Key (id)=(xxx) is not present in table "users"
```

## Ursache
Wenn Email-Bestätigung in Supabase aktiviert ist, wird der User bei `signUp()` nicht sofort in `auth.users` erstellt, sondern erst nach der Email-Bestätigung. Der Code versucht aber trotzdem, sofort ein Profil zu erstellen.

## Implementierte Lösung (ohne DB-Änderungen)

### 1. Email-Bestätigungs-Check
Nach `signUp()` wird geprüft, ob eine Email-Bestätigung erforderlich ist:
- Wenn `email_confirmed_at` fehlt → Profil wird NICHT erstellt
- Nutzer erhält Nachricht: "Please check your email to confirm your account"

### 2. Email-Existenz-Prüfung
VOR der Registrierung wird geprüft, ob die Email bereits existiert:
- Verhindert doppelte Registrierungen
- Bessere Fehlermeldungen für Nutzer

### 3. Foreign Key Error Handling
Wenn der FK-Fehler auftritt (Code 23503):
- Wird als "Email-Bestätigung erforderlich" interpretiert
- Nutzer erhält entsprechende Nachricht

### 4. Profile-Erstellung beim Login
Nach erfolgreichem Login wird automatisch versucht, ein fehlendes Profil zu erstellen:
- Funktion `ensureUserProfile()` in `/lib/auth/profile-completion.ts`
- Wird bei jedem Login aufgerufen
- Erstellt Profil, falls es noch nicht existiert

## Wie es funktioniert

### Bei der Registrierung:
1. Prüfung ob Email bereits existiert
2. `signUp()` aufrufen
3. Prüfen ob Email-Bestätigung nötig ist
4. Falls ja → Keine Profilerstellung, Nutzer informieren
5. Falls nein → Profil erstellen mit Retry-Logic

### Beim Login:
1. Normale Authentifizierung
2. Nach erfolgreichem Login: `ensureUserProfile()` aufrufen
3. Profil wird automatisch erstellt, falls es fehlt
4. Nutzer wird zum Dashboard weitergeleitet

## Vorteile dieser Lösung
- ✅ Keine Datenbank-Änderungen nötig
- ✅ Funktioniert mit aktivierter Email-Bestätigung
- ✅ Bessere Fehlermeldungen für Nutzer
- ✅ Automatische Profile-Erstellung beim Login
- ✅ Verhindert doppelte Registrierungen

## Debug-Modus
Aktiviere Debug-Logging in der Browser-Konsole:
```javascript
localStorage.setItem('debug_auth', 'true')
```

Oder setze in Caprover:
```
NEXT_PUBLIC_DEBUG_AUTH=true
```

## Testen
1. Gehe zu `/debug-auth`
2. Aktiviere Debug-Modus
3. Teste verschiedene Szenarien:
   - Neue Registrierung
   - Registrierung mit existierender Email
   - Login nach Email-Bestätigung

## Dateien
- `/app/(auth)/register/RegisterForm.tsx` - Verbesserte Registrierung
- `/app/(auth)/login/page.tsx` - Profile-Erstellung beim Login
- `/lib/auth/profile-completion.ts` - Profile-Management-Funktionen