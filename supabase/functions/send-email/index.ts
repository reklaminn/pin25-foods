import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SENDPULSE_API_ID = Deno.env.get('SENDPULSE_API_ID') || '';
const SENDPULSE_API_SECRET = Deno.env.get('SENDPULSE_API_SECRET') || '';
const SENDPULSE_FROM_EMAIL = Deno.env.get('SENDPULSE_FROM_EMAIL') || 'noreply@mealora.com';
const SENDPULSE_FROM_NAME = Deno.env.get('SENDPULSE_FROM_NAME') || 'MEALORA';

interface EmailRequest {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

interface SendPulseTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Get SendPulse access token
async function getAccessToken(): Promise<string> {
  const response = await fetch('https://api.sendpulse.com/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: SENDPULSE_API_ID,
      client_secret: SENDPULSE_API_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get SendPulse access token');
  }

  const data: SendPulseTokenResponse = await response.json();
  return data.access_token;
}

// Email templates
function getEmailTemplate(template: string, data: Record<string, any>): string {
  const templates: Record<string, (data: any) => string> = {
    'order-confirmation': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4A6B3C 0%, #5a8045 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .order-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .order-item { padding: 15px; border-bottom: 1px solid #e5e7eb; }
          .order-item:last-child { border-bottom: none; }
          .total { font-size: 24px; font-weight: bold; color: #4A6B3C; text-align: right; margin-top: 20px; }
          .button { display: inline-block; background: #4A6B3C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Siparişiniz Alındı!</h1>
            <p>Sipariş No: ${data.orderNumber}</p>
          </div>
          <div class="content">
            <p>Merhaba ${data.customerName},</p>
            <p>Siparişiniz başarıyla alındı ve hazırlanmaya başlandı. Sağlıklı yaşama bir adım daha yaklaştınız!</p>
            
            <div class="order-details">
              <h3>Sipariş Detayları</h3>
              <div class="order-item">
                <strong>${data.packageName}</strong><br>
                <small>${data.dietType} - ${data.mealCount} öğün</small>
              </div>
              <div class="order-item">
                <strong>Teslimat Adresi:</strong><br>
                ${data.deliveryAddress}
              </div>
              <div class="order-item">
                <strong>Teslimat Tarihi:</strong><br>
                ${data.deliveryDate} - ${data.deliveryTime}
              </div>
              <div class="total">
                Toplam: ${data.totalAmount} ₺
              </div>
            </div>

            <p>Siparişinizin durumunu hesabınızdan takip edebilirsiniz.</p>
            
            <center>
              <a href="${data.orderUrl}" class="button">Siparişimi Görüntüle</a>
            </center>

            <p>Herhangi bir sorunuz olursa bizimle iletişime geçmekten çekinmeyin.</p>
            
            <p>Afiyet olsun! 🍽️</p>
            <p><strong>MEALORA Ekibi</strong></p>
          </div>
          <div class="footer">
            <p>Bu e-posta ${data.customerEmail} adresine gönderilmiştir.</p>
            <p>© 2025 MEALORA. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    'order-confirmed': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .status-badge { background: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 20px 0; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Siparişiniz Onaylandı!</h1>
            <p>Sipariş No: ${data.orderNumber}</p>
          </div>
          <div class="content">
            <p>Merhaba ${data.customerName},</p>
            <p>Harika haber! Siparişiniz onaylandı ve hazırlık aşamasına geçti.</p>
            
            <center>
              <div class="status-badge">
                <strong>Durum:</strong> Onaylandı
              </div>
            </center>

            <p>Yemekleriniz özenle hazırlanıyor ve belirttiğiniz tarihte size ulaştırılacak.</p>
            
            <p><strong>Teslimat Bilgileri:</strong></p>
            <ul>
              <li>Tarih: ${data.deliveryDate}</li>
              <li>Saat: ${data.deliveryTime}</li>
              <li>Adres: ${data.deliveryAddress}</li>
            </ul>

            <center>
              <a href="${data.orderUrl}" class="button">Siparişimi Takip Et</a>
            </center>

            <p>Afiyet olsun! 🍽️</p>
            <p><strong>MEALORA Ekibi</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 MEALORA. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    'order-preparing': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .status-badge { background: #ede9fe; color: #6d28d9; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 20px 0; }
          .chef-icon { font-size: 48px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👨‍🍳 Yemekleriniz Hazırlanıyor!</h1>
            <p>Sipariş No: ${data.orderNumber}</p>
          </div>
          <div class="content">
            <p>Merhaba ${data.customerName},</p>
            
            <center>
              <div class="chef-icon">🍳</div>
              <div class="status-badge">
                <strong>Durum:</strong> Hazırlanıyor
              </div>
            </center>

            <p>Şeflerimiz sizin için özel olarak yemeklerinizi hazırlıyor. Taze malzemeler ve özenli hazırlık ile sağlıklı öğünleriniz yakında yola çıkacak!</p>
            
            <p><strong>Teslimat:</strong> ${data.deliveryDate} - ${data.deliveryTime}</p>

            <p>Afiyet olsun! 🍽️</p>
            <p><strong>MEALORA Ekibi</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 MEALORA. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    'order-shipped': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .status-badge { background: #ffedd5; color: #c2410c; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 20px 0; }
          .truck-icon { font-size: 48px; margin: 20px 0; }
          .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚚 Siparişiniz Yola Çıktı!</h1>
            <p>Sipariş No: ${data.orderNumber}</p>
          </div>
          <div class="content">
            <p>Merhaba ${data.customerName},</p>
            
            <center>
              <div class="truck-icon">🚚</div>
              <div class="status-badge">
                <strong>Durum:</strong> Kargoda
              </div>
            </center>

            <p>Harika haber! Siparişiniz yola çıktı ve yakında kapınızda olacak.</p>
            
            <p><strong>Tahmini Teslimat:</strong> ${data.deliveryDate} - ${data.deliveryTime}</p>
            <p><strong>Teslimat Adresi:</strong><br>${data.deliveryAddress}</p>

            <center>
              <a href="${data.orderUrl}" class="button">Siparişimi Takip Et</a>
            </center>

            <p>Lütfen teslimat saatinde adresinizde bulunun.</p>
            
            <p>Afiyet olsun! 🍽️</p>
            <p><strong>MEALORA Ekibi</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 MEALORA. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    'order-delivered': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .status-badge { background: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 20px 0; }
          .success-icon { font-size: 48px; margin: 20px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Siparişiniz Teslim Edildi!</h1>
            <p>Sipariş No: ${data.orderNumber}</p>
          </div>
          <div class="content">
            <p>Merhaba ${data.customerName},</p>
            
            <center>
              <div class="success-icon">🎉</div>
              <div class="status-badge">
                <strong>Durum:</strong> Teslim Edildi
              </div>
            </center>

            <p>Siparişiniz başarıyla teslim edildi! Sağlıklı öğünlerinizin tadını çıkarın.</p>
            
            <p>Deneyiminizi bizimle paylaşır mısınız? Geri bildiriminiz bizim için çok değerli.</p>

            <center>
              <a href="${data.reviewUrl}" class="button">Değerlendirme Yap</a>
            </center>

            <p>Tekrar sipariş vermek için hesabınıza giriş yapabilirsiniz.</p>
            
            <p>Afiyet olsun! 🍽️</p>
            <p><strong>MEALORA Ekibi</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 MEALORA. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    'order-cancelled': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .status-badge { background: #fee2e2; color: #991b1b; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 20px 0; }
          .button { display: inline-block; background: #4A6B3C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Siparişiniz İptal Edildi</h1>
            <p>Sipariş No: ${data.orderNumber}</p>
          </div>
          <div class="content">
            <p>Merhaba ${data.customerName},</p>
            
            <center>
              <div class="status-badge">
                <strong>Durum:</strong> İptal Edildi
              </div>
            </center>

            <p>Siparişiniz ${data.cancelReason ? `"${data.cancelReason}"` : 'talebiniz üzerine'} iptal edildi.</p>
            
            ${data.refundAmount ? `
              <p><strong>İade Bilgileri:</strong></p>
              <ul>
                <li>İade Tutarı: ${data.refundAmount} ₺</li>
                <li>İade Süresi: 3-5 iş günü</li>
              </ul>
            ` : ''}

            <p>Sizi tekrar aramızda görmek isteriz. Yeni bir sipariş vermek için hesabınıza giriş yapabilirsiniz.</p>

            <center>
              <a href="${data.shopUrl}" class="button">Yeni Sipariş Ver</a>
            </center>

            <p>Herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz.</p>
            
            <p><strong>MEALORA Ekibi</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 MEALORA. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    'payment-success': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .payment-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .amount { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Ödeme Başarılı!</h1>
          </div>
          <div class="content">
            <p>Merhaba ${data.customerName},</p>
            
            <p>Ödemeniz başarıyla alındı. Siparişiniz işleme alındı.</p>
            
            <div class="amount">
              ${data.amount} ₺
            </div>

            <div class="payment-details">
              <p><strong>Ödeme Detayları:</strong></p>
              <ul>
                <li>Sipariş No: ${data.orderNumber}</li>
                <li>İşlem No: ${data.transactionId}</li>
                <li>Tarih: ${data.paymentDate}</li>
                <li>Ödeme Yöntemi: ${data.paymentMethod}</li>
              </ul>
            </div>

            <center>
              <a href="${data.orderUrl}" class="button">Siparişimi Görüntüle</a>
            </center>

            <p>Faturanız email adresinize ayrıca gönderilecektir.</p>
            
            <p><strong>MEALORA Ekibi</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 MEALORA. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    'payment-failed': (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .error-box { background: #fee2e2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Ödeme Başarısız</h1>
          </div>
          <div class="content">
            <p>Merhaba ${data.customerName},</p>
            
            <p>Maalesef ödemeniz gerçekleştirilemedi.</p>
            
            <div class="error-box">
              <p><strong>Hata Nedeni:</strong> ${data.errorMessage || 'Bilinmeyen hata'}</p>
              <p><strong>Sipariş No:</strong> ${data.orderNumber}</p>
            </div>

            <p><strong>Ne yapabilirsiniz?</strong></p>
            <ul>
              <li>Kart bilgilerinizi kontrol edin</li>
              <li>Kartınızda yeterli bakiye olduğundan emin olun</li>
              <li>Farklı bir ödeme yöntemi deneyin</li>
              <li>Bankanızla iletişime geçin</li>
            </ul>

            <center>
              <a href="${data.retryUrl}" class="button">Tekrar Dene</a>
            </center>

            <p>Sorun devam ederse bizimle iletişime geçebilirsiniz.</p>
            
            <p><strong>MEALORA Ekibi</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 MEALORA. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return templates[template]?.(data) || '';
}

// Send email via SendPulse
async function sendEmail(accessToken: string, emailData: EmailRequest): Promise<boolean> {
  const htmlContent = getEmailTemplate(emailData.template, emailData.data);

  const response = await fetch('https://api.sendpulse.com/smtp/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      email: {
        html: htmlContent,
        text: emailData.subject,
        subject: emailData.subject,
        from: {
          name: SENDPULSE_FROM_NAME,
          email: SENDPULSE_FROM_EMAIL,
        },
        to: [
          {
            email: emailData.to,
          },
        ],
      },
    }),
  });

  return response.ok;
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();

    // Validate request
    if (!emailRequest.to || !emailRequest.subject || !emailRequest.template) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get access token
    const accessToken = await getAccessToken();

    // Send email
    const success = await sendEmail(accessToken, emailRequest);

    if (success) {
      return new Response(
        JSON.stringify({ success: true, message: 'Email sent successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
