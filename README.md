# MEALORA - Premium Sağlıklı Yemek Servisi

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler

#### 1. Genel Özellikler
- Modern, responsive tasarım
- Türkçe dil desteği
- MEALORA marka kimliği
- Mobile-first yaklaşım

#### 2. Kullanıcı Özellikleri
- Üyelik sistemi (kayıt/giriş)
- Profil yönetimi
- Adres yönetimi
- Sipariş geçmişi
- Sipariş takibi
- Dashboard

#### 3. Sipariş Sistemi
- Paket seçimi wizard'ı (7 adım)
- Diyet türü seçimi (4 tür)
- Öğün planı seçimi
- Kalori hedefi belirleme
- Teslimat günü seçimi
- Adres seçimi/ekleme
- Promosyon kodu sistemi
- Sipariş özeti

#### 4. Ödeme Sistemi
- **İyzico Entegrasyonu**
  - 3D Secure ödeme
  - Kredi kartı ile ödeme
  - Taksit seçenekleri
  - Güvenli ödeme sayfası
  - Ödeme callback yönetimi
  - Başarılı/başarısız ödeme sayfaları

#### 5. E-posta Sistemi
- **SendPulse Entegrasyonu**
  - Supabase Edge Function ile entegrasyon
  - 8 farklı email template:
    - Sipariş onayı
    - Sipariş onaylandı
    - Hazırlanıyor
    - Kargoda
    - Teslim edildi
    - İptal edildi
    - Ödeme başarılı
    - Ödeme başarısız
  - Otomatik email gönderimi
  - Durum değişikliği bildirimleri

#### 6. Veritabanı
- Supabase PostgreSQL
- Row Level Security (RLS)
- Otomatik trigger'lar
- Enum types
- İlişkisel tablolar:
  - members
  - admins
  - addresses
  - orders
  - order_items
  - order_status_history

#### 7. Admin Panel
- 12 sayfa
- Sipariş yönetimi
- Üye yönetimi
- Menü yönetimi
- İstatistikler

### 🔄 Entegrasyonlar

#### İyzico Ödeme Sistemi
```typescript
// Ödeme başlatma
const result = await initializePayment({
  memberId,
  packageType,
  dietType,
  // ... diğer parametreler
});

// Ödeme sayfasına yönlendirme
window.location.href = result.paymentPageUrl;
```

#### SendPulse Email Sistemi
```typescript
// Email gönderme
await sendEmail({
  to: 'customer@email.com',
  subject: 'Sipariş Onayı',
  template: 'order-confirmation',
  data: {
    customerName: 'Ahmet Yılmaz',
    orderNumber: 'ORD-2025-000001',
    // ... diğer veriler
  }
});
```

### 📁 Proje Yapısı

```
mealora/
├── app/
│   ├── api/
│   │   └── payment/
│   │       ├── initialize/
│   │       └── callback/
│   ├── checkout/
│   │   ├── page.tsx
│   │   ├── success/
│   │   └── failed/
│   ├── hesabim/
│   │   ├── page.tsx
│   │   └── siparislerim/
│   └── ...
├── components/
│   ├── member/
│   │   ├── order-list.tsx
│   │   ├── order-details-modal.tsx
│   │   ├── profile-edit-modal.tsx
│   │   └── address-management-modal.tsx
│   └── ui/
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   ├── orders.ts
│   ├── addresses.ts
│   ├── iyzico.ts
│   ├── email.ts
│   └── payment.ts
├── supabase/
│   ├── functions/
│   │   └── send-email/
│   └── migrations/
│       ├── 001_create_members_table.sql
│       ├── 002_create_addresses_table.sql
│       ├── 003_create_orders_tables.sql
│       └── 004_add_order_triggers.sql
└── ...
```

### 🔐 Ortam Değişkenleri

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# İyzico (Sandbox)
NEXT_PUBLIC_IYZICO_API_KEY=your_iyzico_api_key
NEXT_PUBLIC_IYZICO_SECRET_KEY=your_iyzico_secret_key
NEXT_PUBLIC_IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# SendPulse
SENDPULSE_API_ID=your_sendpulse_api_id
SENDPULSE_API_SECRET=your_sendpulse_api_secret
SENDPULSE_FROM_EMAIL=noreply@mealora.com
SENDPULSE_FROM_NAME=MEALORA

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 🚀 Kurulum

1. **Bağımlılıkları yükle:**
```bash
npm install
```

2. **Ortam değişkenlerini ayarla:**
```bash
cp .env.example .env.local
# .env.local dosyasını düzenle
```

3. **Supabase migration'ları çalıştır:**
```bash
# Supabase CLI ile
supabase db push

# Veya Supabase Dashboard'dan SQL Editor'de çalıştır
```

4. **Edge Function'ı deploy et:**
```bash
supabase functions deploy send-email
```

5. **Geliştirme sunucusunu başlat:**
```bash
npm run dev
```

### 📝 Kullanım

#### Sipariş Oluşturma ve Ödeme

1. Kullanıcı paket seçer
2. Checkout sayfasında bilgileri doldurur
3. "Siparişi Tamamla" butonuna tıklar
4. Sipariş veritabanına kaydedilir
5. İyzico ödeme sayfasına yönlendirilir
6. Ödeme yapılır
7. Callback ile sonuç alınır
8. Sipariş durumu güncellenir
9. Email gönderilir

#### Email Gönderimi

Email'ler otomatik olarak şu durumlarda gönderilir:
- Sipariş oluşturulduğunda
- Ödeme başarılı olduğunda
- Sipariş durumu değiştiğinde
- Ödeme başarısız olduğunda

### 🔧 Geliştirme

#### Yeni Email Template Ekleme

1. `supabase/functions/send-email/index.ts` dosyasına template ekle
2. `lib/email.ts` dosyasına helper function ekle
3. Gerekli yerde email gönder

#### Yeni Ödeme Yöntemi Ekleme

1. `lib/iyzico.ts` dosyasına yeni method ekle
2. `app/api/payment/` altına yeni endpoint ekle
3. Checkout sayfasında seçenek ekle

### 📊 Veritabanı Şeması

#### Orders Tablosu
- id (uuid)
- order_number (text, auto-generated)
- member_id (uuid, FK)
- status (enum: 7 durum)
- payment_status (enum: 4 durum)
- payment_method (enum: 4 yöntem)
- amounts (total, discount, final, promo)
- package details
- delivery details
- timestamps

#### Order Items Tablosu
- id (uuid)
- order_id (uuid, FK)
- meal details
- nutrition info
- delivery_date

#### Order Status History Tablosu
- id (uuid)
- order_id (uuid, FK)
- status (enum)
- notes (text)
- created_at

### 🎨 Tasarım Sistemi

#### Renkler
- Primary: #4A6B3C (Yeşil)
- Secondary: #38bdf8 (Mavi)
- Accent: #f472b6 (Pembe)
- Background: #171717 (Koyu)
- Surface: #262626
- Text: #FFFFFF

#### Tipografi
- Headings: Poppins
- Body: Inter
- Logo: Montserrat

### 🔒 Güvenlik

- Row Level Security (RLS) aktif
- HTTPS zorunlu
- API key'ler environment variable'da
- CSRF koruması
- XSS koruması
- SQL injection koruması

### 📱 Responsive Tasarım

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 🐛 Bilinen Sorunlar

- Profil fotoğrafı yükleme placeholder
- Email değişikliği doğrulama yok
- Harita entegrasyonu yok

### 🚀 Gelecek Özellikler

- [ ] Favori yemekler
- [ ] Bildirim merkezi
- [ ] Şifre sıfırlama
- [ ] Email doğrulama
- [ ] OAuth entegrasyonu
- [ ] Harita entegrasyonu
- [ ] Fatura/makbuz PDF
- [ ] Tekrar sipariş
- [ ] Teslimat takibi
- [ ] Değerlendirme sistemi

### 📞 Destek

- Email: destek@mealora.com
- Telefon: 0555 123 45 67
- WhatsApp: +90 555 123 45 67

### 📄 Lisans

© 2025 MEALORA. Tüm hakları saklıdır.
