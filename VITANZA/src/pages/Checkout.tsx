import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { formatCurrency } from '../utils/format';
import { FulfillmentType } from '../types';

export const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'yape' | 'plin'>('card');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Redirect si no está autenticado, es ADMIN, o el carrito está vacío
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'ADMIN') {
      navigate('/admin');
    } else if (items.length === 0) {
      navigate('/cart');
    }
  }, [user, items.length, navigate]);

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (fulfillmentType === 'delivery' && !address) {
      setError('Por favor ingresa tu dirección de entrega');
      return;
    }

    if (!phone) {
      setError('Por favor ingresa tu número de teléfono');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      console.log('🛒 Creando pedido en Supabase...');

      // Crear el pedido en Supabase
      const order = await createOrder(
        items,
        fulfillmentType,
        fulfillmentType === 'delivery' ? address : undefined,
        phone,
        paymentMethod
      );

      if (!order) {
        throw new Error('No se pudo crear el pedido');
      }

      console.log('✅ Pedido creado:', order.id);

      // Limpiar carrito
      await clearCart();

      // Redirigir a la página de estado del pedido
      navigate(`/order/${order.id}`);
    } catch (err: any) {
      console.error('❌ Error al crear pedido:', err);
      setError(err.message || 'Error al procesar el pedido. Intenta de nuevo.');
      setIsProcessing(false);
    }
  };

  // Si no está autenticado o el carrito está vacío, no renderizar nada (el useEffect redirigirá)
  if (!user || items.length === 0) {
    return null;
  }

  const fulfillmentOptions = [
    { id: 'delivery' as FulfillmentType, label: 'Delivery', description: '30-45 min' },
    { id: 'pickup' as FulfillmentType, label: 'Recoger', description: '15-20 min' },
    { id: 'dine_in' as FulfillmentType, label: 'Comer aquí', description: 'Reserva mesa' },
  ];

  const paymentOptions = [
    { id: 'card' as const, label: 'Tarjeta', icon: CreditCard },
    { id: 'yape' as const, label: 'Yape', icon: Smartphone },
    { id: 'plin' as const, label: 'Plin', icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate('/cart')} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al carrito
        </Button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Tipo de Servicio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fulfillmentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFulfillmentType(option.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    fulfillmentType === option.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Información de Contacto
            </h2>
            <div className="space-y-4">
              <Input
                label="Número de Teléfono"
                type="tel"
                placeholder="+51 999 888 777"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              {fulfillmentType === 'delivery' && (
                <Input
                  label="Dirección de Entrega"
                  type="text"
                  placeholder="Av. Javier Prado 1234, San Isidro"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Método de Pago
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === option.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                    <p className="font-semibold text-gray-900">{option.label}</p>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Resumen
            </h2>
            <div className="space-y-3 mb-6">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-gray-700">
                  <span>
                    {item.quantity}x {item.menuItem.name}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(item.customizedPrice * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between text-2xl font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-emerald-600">{formatCurrency(total)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handlePlaceOrder}
              isLoading={isProcessing}
            >
              Confirmar Pedido
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
