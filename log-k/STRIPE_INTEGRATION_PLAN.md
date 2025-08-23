# Stripe Integration Implementation Plan

## Benötigte Stripe API Schlüssel

1. **STRIPE_SECRET_KEY** - Server-seitiger Schlüssel für API-Aufrufe
2. **STRIPE_WEBHOOK_SECRET** - Webhook-Signatur zur Verifizierung  
3. **STRIPE_BASIC_PRICE_ID** - Price ID für Basic Plan (19,99€/Jahr)
4. **STRIPE_PRO_PRICE_ID** - Price ID für Pro Plan (49,99€/Jahr)

## Aktuelle Buchungspfade

### 1. Landingpage (/)
- Pricing Cards mit "Choose Basic" und "Choose Pro" Buttons
- Links führen zu `/subscription/checkout?plan=basic` bzw. `?plan=premium`
- **Problem**: Diese Route existiert noch nicht richtig implementiert

### 2. Dashboard/Settings
- `/subscription/choose` - Hauptseite für Planauswahl
- `/subscription/expired` - Für abgelaufene Trials/Subscriptions  
- Verwendet `SubscriptionPlans` Component mit dynamischen Buttons

### 3. Aktueller Status
- Stripe-Code ist vorbereitet aber auskommentiert
- API-Endpoints existieren aber geben nur Placeholder zurück
- "Stripe integration coming soon" Meldung wird angezeigt

## Implementierungsschritte

### 1. Environment Variables hinzufügen
```bash
# In .env.local hinzufügen:
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
```

Update `.env.production` Template mit neuen Variablen.

### 2. Stripe SDK installieren
```bash
npm install stripe
```

### 3. API Routes aktivieren

#### `/api/subscription/create-checkout/route.ts`
- Kommentare entfernen
- Stripe initialisieren
- Checkout Session Logic aktivieren

#### `/api/subscription/webhook/route.ts`
- Webhook Handler Code aktivieren
- Event Handler implementieren:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### 4. Landingpage Route fixen

**Option A**: Neue Route `/subscription/checkout` erstellen
- Parameter: `?plan=basic` oder `?plan=premium`
- Redirect zu Stripe Checkout

**Option B**: Links auf `/subscription/choose` umleiten
- Einfacher, nutzt existierende Komponente
- Konsistente User Experience

### 5. Stripe Dashboard Konfiguration

#### Price IDs erstellen
1. Basic Plan (19,99€/Jahr)
   - Recurring yearly
   - Product: "Log-K Basic"
   
2. Pro Plan (49,99€/Jahr)
   - Recurring yearly
   - Product: "Log-K Pro"

#### Webhook Endpoint konfigurieren
- URL: `https://log-k.com/api/subscription/webhook`
- Events auswählen:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### 6. Testing Workflow

1. Test mit Stripe Test Keys
2. Test Checkout Flow
3. Test Webhook Events (Stripe CLI)
4. Test Subscription Updates
5. Test Cancellations

### 7. Datenbank Updates

Sicherstellen dass `user_subscriptions` Tabelle folgende Felder hat:
- `stripe_customer_id`
- `stripe_subscription_id`
- `subscription_tier`
- `subscription_source` = 'stripe'
- `valid_until`

## Dateien die geändert werden müssen

1. `/app/api/subscription/create-checkout/route.ts` - Stripe Code aktivieren
2. `/app/api/subscription/webhook/route.ts` - Webhook Handler aktivieren
3. `/lib/subscription/service.server.ts` - Stripe sync functions
4. `.env.local` - API Keys hinzufügen
5. `.env.production` - Template updaten
6. `/app/page.tsx` - Landing page links fixen (optional)
7. `package.json` - Stripe dependency

## Wichtige Überlegungen

- **Testing**: Erst mit Test Keys, dann Production
- **Migration**: Existierende iOS Subscriptions nicht beeinflussen
- **Fallback**: iOS App bleibt primärer Subscription Path bis Stripe stabil läuft
- **Security**: Webhook Signature Verification ist kritisch
- **Monitoring**: Stripe Dashboard für Transaction Monitoring nutzen

## Nächste Schritte

1. Stripe Account Setup vervollständigen
2. Test API Keys generieren
3. Implementierung starten mit Test Environment
4. Testing & QA
5. Production Deployment