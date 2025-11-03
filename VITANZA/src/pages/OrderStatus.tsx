import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Truck, Package, Home } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { OrderStatus as OrderStatusType, Order } from '../types';
import { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { formatCurrency } from '../utils/format';

export const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchOrderById } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      setIsLoading(true);
      console.log('📦 Cargando pedido desde Supabase:', orderId);

      const fetchedOrder = await fetchOrderById(orderId);

      if (!fetchedOrder) {
        setError('Pedido no encontrado');
        return;
      }

      console.log('✅ Pedido cargado:', fetchedOrder);
      setOrder(fetchedOrder);
    } catch (err) {
      console.error('❌ Error al cargar pedido:', err);
      setError('Error al cargar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600 text-lg mt-4">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Pedido no encontrado'}</h2>
          <Button onClick={() => navigate('/menu')}>Volver al menú</Button>
        </div>
      </div>
    );
  }

  const currentStatus = order.status;

  const statusSteps = [
    { status: 'received' as OrderStatusType, label: 'Recibido', icon: CheckCircle },
    { status: 'preparing' as OrderStatusType, label: 'Preparando', icon: Clock },
    { status: 'ready' as OrderStatusType, label: 'Listo', icon: Package },
    { status: 'en_route' as OrderStatusType, label: 'En Camino', icon: Truck },
    { status: 'delivered' as OrderStatusType, label: 'Entregado', icon: Home },
  ];

  const currentIndex = statusSteps.findIndex((s) => s.status === currentStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentStatus === 'delivered' ? '¡Pedido Entregado!' : '¡Pedido Confirmado!'}
          </h1>
          <p className="text-lg text-gray-600">Pedido #{orderId}</p>
        </div>

        <Card className="p-8 mb-8">
          <div className="relative">
            <div className="absolute top-8 left-0 w-full h-1 bg-gray-200">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>

            <div className="relative flex justify-between">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isPast = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isCompleted = isPast || isCurrent;

                return (
                  <div key={step.status} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-emerald-200' : ''}`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {currentStatus === 'delivered' ? (
          <Card className="p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ¡Disfruta tu comida saludable!
            </h2>
            <p className="text-gray-600 mb-6">
              No olvides escanear el QR en tu pedido para exportar los macros a tus apps de
              fitness
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/dashboard')}>
                Ver mi Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/menu')}>
                Hacer otro pedido
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Información del Pedido
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Tiempo estimado:</span>
                  <span className="font-semibold">{order.estimatedTime} minutos</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipo de entrega:</span>
                  <span className="font-semibold">
                    {order.fulfillmentType === 'delivery' && 'Delivery'}
                    {order.fulfillmentType === 'pickup' && 'Recoger en local'}
                    {order.fulfillmentType === 'dine_in' && 'Comer en local'}
                  </span>
                </div>
                {order.deliveryAddress && (
                  <div className="flex justify-between">
                    <span>Dirección:</span>
                    <span className="font-semibold text-right">{order.deliveryAddress}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estado actual:</span>
                  <span className="font-semibold text-emerald-600">
                    {statusSteps[currentIndex].label}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Items del Pedido</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start pb-4 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.menuItem.name}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.customizedPrice * item.quantity)}
                    </p>
                  </div>
                ))}
                <div className="pt-4 border-t-2 border-gray-200">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-emerald-600">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
