import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { formatCurrency } from '../utils/currency';
import { useAuth } from '../context/authContext';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('Missing payment session.');
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        const { data } = await api.get(`/payments/verify-session?session_id=${encodeURIComponent(sessionId)}`);
        setOrder(data.data.order);
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (err) {
        setError(err.response?.data?.message || 'Could not confirm your order.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas pt-28 pb-16 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-tan animate-spin" />
        <p className="text-fog text-sm">Confirming payment with your bank…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-canvas pt-28 pb-16 px-6 max-w-lg mx-auto text-center">
        <p className="text-rust mb-6">{error || 'Order not found.'}</p>
        <Link to="/orders" className="btn-primary inline-flex px-6 py-2.5">View orders</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-16 px-6">
      <div className="max-w-lg mx-auto card-linen border border-border rounded-3xl p-8 text-center">
        <CheckCircle className="w-14 h-14 text-sage mx-auto mb-4" />
        <h1 className="text-2xl text-espresso mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
          Payment successful
        </h1>
        <p className="text-fog text-sm mb-6">
          Order <span className="text-espresso font-medium">{order.orderNumber}</span> is confirmed.
          You will receive updates as it moves through fulfillment.
        </p>
        <p className="text-lg font-medium text-espresso mb-8">
          Total {formatCurrency(order.totalAmount, order.currency || user?.preferredCurrency || 'USD')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/orders/${order._id}`} className="btn-primary px-6 py-2.5 text-sm">
            Order details & tracking
          </Link>
          <Link to="/products" className="btn-outline px-6 py-2.5 text-sm">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
