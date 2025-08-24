# Stripe Subscription Source Migration

## Problem
Der Webhook funktioniert, aber die Datenbank lehnt "stripe" als subscription_source ab:
```
invalid input value for enum subscription_source: "stripe"
```

## Lösung
Erweitere den subscription_source ENUM um "stripe".

## Migration ausführen

### 1. Gehe zu Supabase Dashboard
- https://supabase.com/dashboard/project/dqzqzbkgxboklbdsdmvf
- SQL Editor öffnen

### 2. Führe diese Migration aus:
```sql
-- Add 'stripe' to subscription_source enum
ALTER TYPE subscription_source ADD VALUE IF NOT EXISTS 'stripe';
```

### 3. Verifiziere die Änderung:
```sql
-- Check all possible values
SELECT unnest(enum_range(NULL::subscription_source));
```

Du solltest sehen:
- trial
- ios  
- web
- stripe ← NEU

### 4. Teste den Webhook erneut
- Gehe zu Stripe Dashboard
- Resende das `checkout.session.completed` Event
- Prüfe CapRover Logs - sollte jetzt funktionieren!

## Nach der Migration

Dein Account sollte dann:
- **subscription_source**: "stripe" ✅
- **stripe_customer_id**: Gefüllt ✅
- **stripe_subscription_id**: Gefüllt ✅
- **valid_until**: 2026-08-24 ✅

## Alternative (falls Migration nicht möglich)

Falls du die Datenbank nicht ändern kannst, können wir im Code "web" statt "stripe" verwenden. Aber die Migration ist die saubere Lösung!