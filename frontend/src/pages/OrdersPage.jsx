import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import { formatCurrency } from '../utils/currency';
import { useAuth } from '../context/authContext';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-50 text-amber-800 border-amber-200',
      confirmed: 'bg-sky-50 text-sky-800 border-sky-200',
      processing: 'bg-purple-50 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      cancelled: 'bg-rose-50 text-rose-800 border-rose-200',
    };
    return colors[status] || 'bg-linen text-espresso border-border';
  };

  const fetchOrders = async (page = 1, status = statusFilter) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      if (status) params.append('status', status);

      const response = await api.get(`/users/me/orders?${params}`);
      setOrders(response.data.data.orders);
      setPagination(response.data.data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    fetchOrders(1, status);
  };

  const handlePageChange = (page) => {
    fetchOrders(page, statusFilter);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-canvas pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-tan/20 border-t-tan mx-auto"></div>
            <p className="mt-4 text-fog text-sm">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="eyebrow mb-3">Order Management</p>
          <h1
            className="text-espresso leading-tight mb-3"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
            }}
          >
            My <em style={{ fontStyle: "italic", color: "#8B5E3C" }}>Orders</em>
          </h1>
          <p className="text-fog text-sm md:text-base">Track and manage your order history</p>
        </div>

        {/* Status Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusFilter(option.value)}
                className={`px-4 py-2 rounded-full text-xs md:text-[13px] font-medium transition-all duration-300 ${
                  statusFilter === option.value
                    ? 'bg-tan text-paper shadow-soft'
                    : 'bg-paper text-espresso border border-border hover:border-tan/60 hover:bg-linen'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4">
            <p className="text-rose-800 text-sm">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-linen border border-border flex items-center justify-center">
              <Package className="w-8 h-8 text-tan" />
            </div>
            <h3
              className="text-espresso text-xl md:text-2xl mb-3"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 400,
              }}
            >
              No orders found
            </h3>
            <p className="text-fog text-sm md:text-base mb-8 max-w-md mx-auto">
              {statusFilter ? `No ${statusFilter} orders found.` : 'You haven\'t placed any orders yet.'}
            </p>
            {!statusFilter && (
              <Link to="/products" className="btn-primary text-sm">
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="card card-lift group">
                {/* Order Header */}
                <div className="p-4 md:p-6 border-b border-border">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                    <div className="flex-1">
                      <h3
                        className="text-espresso text-base md:text-lg mb-1"
                        style={{
                          fontFamily: '"Playfair Display", serif',
                          fontWeight: 500,
                        }}
                      >
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-fog text-xs md:text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {order.paymentStatus === 'unpaid' && (
                          <span className="badge-tan text-[10px]">
                            Payment pending
                          </span>
                        )}
                        <span className={`inline-flex px-3 py-1 text-[10px] md:text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p
                        className="text-sienna text-lg md:text-xl font-semibold"
                        style={{ fontFamily: '"Playfair Display", serif' }}
                      >
                        {formatCurrency(order.totalAmount, order.currency || user?.preferredCurrency)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 md:p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 md:gap-4">
                        <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-linen rounded-xl overflow-hidden border border-border">
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0].url || item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-tan/40">
                              <Package className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.product?._id}`}
                            className="text-espresso text-sm md:text-base font-medium hover:text-tan transition-colors link-underline block truncate"
                          >
                            {item.product?.name || 'Product'}
                          </Link>
                          <p className="text-fog text-xs md:text-sm mt-0.5">
                            Qty: {item.quantity} × {formatCurrency(item.price, order.currency || user?.preferredCurrency)}
                          </p>
                        </div>
                        <div
                          className="text-espresso text-sm md:text-base font-semibold flex-shrink-0"
                          style={{ fontFamily: '"Playfair Display", serif' }}
                        >
                          {formatCurrency((item.quantity * item.price), order.currency || user?.preferredCurrency)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-4 md:p-6 bg-linen/30 border-t border-border">
                  <div className="flex justify-between items-center">
                    <div className="text-fog text-xs md:text-sm">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    <Link
                      to={`/orders/${order._id}`}
                      className="flex items-center gap-1.5 text-tan hover:text-sienna text-xs md:text-sm font-medium transition-colors group"
                    >
                      View Details
                      <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-10 md:mt-12 flex justify-center">
            <nav className="inline-flex items-center gap-1 md:gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-border bg-paper flex items-center justify-center text-espresso hover:border-tan/60 hover:bg-linen transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-paper disabled:hover:border-border"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="hidden md:flex items-center gap-1">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[40px] h-10 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      page === currentPage
                        ? 'bg-tan text-paper shadow-soft'
                        : 'bg-paper border border-border text-espresso hover:border-tan/60 hover:bg-linen'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <div className="md:hidden flex items-center gap-2 px-3">
                <span className="text-espresso text-sm font-medium">
                  {currentPage} / {pagination.pages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-border bg-paper flex items-center justify-center text-espresso hover:border-tan/60 hover:bg-linen transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-paper disabled:hover:border-border"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;