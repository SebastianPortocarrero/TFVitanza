import { useEffect } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { MacroDisplay } from '../components/MacroDisplay';
import { formatCurrency } from '../utils/format';

export const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Bloquear acceso a ADMIN
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const totalMacros = items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.customizedMacros.calories * item.quantity,
      protein: acc.protein + item.customizedMacros.protein * item.quantity,
      carbs: acc.carbs + item.customizedMacros.carbs * item.quantity,
      fat: acc.fat + item.customizedMacros.fat * item.quantity,
      fiber: (acc.fiber || 0) + (item.customizedMacros.fiber || 0) * item.quantity,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => navigate('/menu')} className="mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al menú
          </Button>

          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">Agrega platillos para continuar</p>
            <Button size="lg" onClick={() => navigate('/menu')}>
              Explorar menú
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate('/menu')} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continuar comprando
        </Button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mi Carrito</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex gap-6">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {item.menuItem.name}
                        </h3>
                        {item.customizations.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Personalizaciones: {item.customizations.map((c) => c.label).join(', ')}
                          </p>
                        )}
                      </div>
                      <button
                        aria-label='Personalizacion'
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <MacroDisplay macros={item.customizedMacros} size="sm" />

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          aria-label='quitar'
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-emerald-500 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          aria-label='aumentar'
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-emerald-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xl font-bold text-emerald-600">
                        {formatCurrency(item.customizedPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(total)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Delivery</span>
                  <span className="font-semibold">Gratis</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-2xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-emerald-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Macros Totales</h3>
                <MacroDisplay macros={totalMacros} size="sm" vertical />
              </div>

              <Button size="lg" className="w-full" onClick={handleCheckout}>
                {user ? 'Proceder al pago' : 'Ingresar para continuar'}
              </Button>

              <p className="text-sm text-gray-500 text-center mt-4">
                Delivery estimado: 30-45 minutos
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
