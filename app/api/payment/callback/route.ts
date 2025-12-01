import { NextRequest, NextResponse } from 'next/server';
import { iyzicoService } from '@/lib/iyzico';
import { supabase } from '@/lib/supabase';
import { sendPaymentSuccessEmail, sendPaymentFailedEmail, sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failed?error=missing_token`
      );
    }

    // Retrieve payment result from İyzico
    const result = await iyzicoService.retrievePaymentResult(
      token,
      formData.get('conversationId') as string
    );

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      // Payment successful - update order in database
      const orderId = result.conversationId;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          payment_date: new Date().toISOString(),
          transaction_id: result.paymentId,
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select(`
          *,
          delivery_address:addresses(*)
        `)
        .single();

      if (orderError) {
        console.error('Order update error:', orderError);
        throw new Error('Sipariş güncellenemedi');
      }

      // Get member details
      const { data: member } = await supabase
        .from('members')
        .select('*')
        .eq('id', order.member_id)
        .single();

      if (member) {
        // Send payment success email
        await sendPaymentSuccessEmail({
          customerEmail: member.email,
          customerName: `${member.first_name} ${member.last_name}`,
          orderNumber: order.order_number,
          transactionId: result.paymentId || '',
          amount: order.final_amount,
          paymentDate: new Date().toLocaleDateString('tr-TR'),
          paymentMethod: 'Kredi Kartı',
          orderUrl: `${process.env.NEXT_PUBLIC_APP_URL}/hesabim/siparislerim`
        });

        // Send order confirmation email
        await sendOrderConfirmationEmail({
          customerEmail: member.email,
          customerName: `${member.first_name} ${member.last_name}`,
          orderNumber: order.order_number,
          packageName: order.package_type,
          dietType: order.diet_type,
          mealCount: order.meal_count,
          deliveryAddress: order.delivery_address ? 
            `${order.delivery_address.address_line1}, ${order.delivery_address.district}, ${order.delivery_address.city}` : 
            'Belirtilmemiş',
          deliveryDate: order.delivery_date ? 
            new Date(order.delivery_date).toLocaleDateString('tr-TR') : 
            'Belirtilmemiş',
          deliveryTime: order.delivery_time_slot || 'Belirtilmemiş',
          totalAmount: order.final_amount,
          orderUrl: `${process.env.NEXT_PUBLIC_APP_URL}/hesabim/siparislerim`
        });
      }

      // Redirect to success page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${order.order_number}`
      );
    } else {
      // Payment failed - update order status
      const orderId = result.conversationId;

      await supabase
        .from('orders')
        .update({
          payment_status: 'failed'
        })
        .eq('id', orderId);

      // Get order and member details for email
      const { data: order } = await supabase
        .from('orders')
        .select('*, member:members(*)')
        .eq('id', orderId)
        .single();

      if (order?.member) {
        // Send payment failed email
        await sendPaymentFailedEmail({
          customerEmail: order.member.email,
          customerName: `${order.member.first_name} ${order.member.last_name}`,
          orderNumber: order.order_number,
          errorMessage: result.errorMessage || 'Ödeme işlemi başarısız oldu',
          retryUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?retry=${orderId}`
        });
      }

      // Redirect to failed page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failed?error=${encodeURIComponent(result.errorMessage || 'payment_failed')}`
      );
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failed?error=callback_error`
    );
  }
}
