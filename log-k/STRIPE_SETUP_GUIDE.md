# Stripe Setup Guide für Log-K

## Was du in deinem Stripe Account machen musst:

### 1. Test Mode aktivieren
- Gehe zu https://dashboard.stripe.com
- Stelle sicher, dass "Test mode" aktiviert ist (Toggle oben rechts)

### 2. API Keys kopieren
- Gehe zu **Developers** → **API keys**
- Kopiere:
  - **Publishable key**: `pk_test_...`
  - **Secret key**: `sk_test_...`

### 3. Produkte & Preise erstellen
- Gehe zu **Products** → **Add product**

#### Basic Plan:
```
Name: Log-K Basic
Price: 19.99 EUR
Billing period: Yearly
```
→ Kopiere die Price ID: `price_...`

#### Pro Plan:
```
Name: Log-K Pro  
Price: 49.99 EUR
Billing period: Yearly
```
→ Kopiere die Price ID: `price_...`

### 4. Webhook erstellen
- Gehe zu **Developers** → **Webhooks**
- Klicke **Add endpoint**
- **Endpoint URL**: `https://log-k.com/api/subscription/webhook`
- **Events to send**: Wähle:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- Klicke **Add endpoint**
- Kopiere das **Signing secret**: `whsec_...`

## Environment Variables für CapRover:

In CapRover Web UI → App Configs → Environmental Variables:

```bash
# Stripe Test Keys (für Development)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
```

## Test Workflow:

### 1. Lokaler Test mit ngrok (optional)
```bash
# Installiere ngrok
brew install ngrok

# Starte lokalen Dev Server
npm run dev

# In anderem Terminal:
ngrok http 3000

# Update Webhook URL in Stripe zu ngrok URL
# z.B. https://abc123.ngrok.io/api/subscription/webhook
```

### 2. Test Checkout Flow
- Gehe zu https://log-k.com/subscription/choose
- Wähle einen Plan
- Nutze Test Kreditkarte: `4242 4242 4242 4242`
- Beliebiges Ablaufdatum in der Zukunft
- Beliebiger CVC

### 3. Verifiziere in Stripe Dashboard
- **Payments** → sollte die Test-Zahlung zeigen
- **Customers** → sollte den Kunden zeigen
- **Webhooks** → sollte erfolgreiche Events zeigen

### 4. Verifiziere in Supabase
- Tabelle `user_subscriptions` sollte neuen Eintrag haben mit:
  - `subscription_source`: 'stripe'
  - `stripe_customer_id`: gefüllt
  - `stripe_subscription_id`: gefüllt

## Production Deployment:

### 1. Stripe Live Mode
- Wechsle zu **Live mode** in Stripe
- Erstelle neue API Keys (live)
- Erstelle Produkte erneut im Live Mode
- Erstelle Webhook erneut im Live Mode

### 2. Update CapRover Environment
```bash
# Production Keys
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
STRIPE_BASIC_PRICE_ID=price_live_...
STRIPE_PRO_PRICE_ID=price_live_...
```

### 3. Deploy & Test
- Git push → CapRover auto-deploy
- Force rebuild wenn nötig
- Test mit echter Kreditkarte (kleiner Betrag)

## Troubleshooting:

### Webhook Signature Fehler
- Stelle sicher, dass `STRIPE_WEBHOOK_SECRET` korrekt ist
- Prüfe ob die URL exakt übereinstimmt (mit/ohne trailing slash)

### Checkout Session erstellt keine Subscription
- Prüfe Webhook Events in Stripe Dashboard
- Prüfe CapRover Logs für Fehler
- Stelle sicher, dass Supabase Service Role Key konfiguriert ist

### User kann nicht bezahlen
- Prüfe ob alle Price IDs korrekt sind
- Teste mit verschiedenen Test-Kreditkarten
- Prüfe Browser Console für JavaScript Fehler

## Monitoring:

- **Stripe Dashboard**: Payments, Subscriptions, Customers
- **CapRover Logs**: Webhook Processing, Errors
- **Supabase**: user_subscriptions Tabelle
- **Log-K /api/test**: Zeigt ob alle ENV vars gesetzt sind