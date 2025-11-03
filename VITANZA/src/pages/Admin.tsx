import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Package, ShoppingBag, Users, Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { useMenu } from '../hooks/useMenu';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { formatCurrency } from '../utils/format';
import { OrderStatus, Order } from '../types';

type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'danger';

export const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'orders'>('dashboard');
  const { fetchAllOrders, updateOrderStatus } = useOrders();
  const { items: menuItems, isLoading: menuLoading } = useMenu();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect si no es admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'ADMIN') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Cargar todos los pedidos
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      const orders = await fetchAllOrders();
      setAllOrders(orders);
      setIsLoading(false);
    };

    if (user?.role === 'ADMIN') {
      loadOrders();
    }
  }, [user]);

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  if (isLoading || menuLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600 text-lg mt-4">Cargando panel admin...</p>
        </div>
      </div>
    );
  }

  // Calcular estadísticas reales
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ordersToday = allOrders.filter(o => {
    const orderDate = new Date(o.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });

  const totalToday = ordersToday.reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      icon: ShoppingBag,
      label: 'Pedidos Hoy',
      value: ordersToday.length.toString(),
      change: `${allOrders.length} total`,
      color: 'text-blue-600'
    },
    {
      icon: Users,
      label: 'Clientes Activos',
      value: new Set(allOrders.map(o => o.userId)).size.toString(),
      change: 'únicos',
      color: 'text-emerald-600'
    },
    {
      icon: Package,
      label: 'Platillos en Menú',
      value: menuItems.length.toString(),
      change: 'disponibles',
      color: 'text-purple-600'
    },
    {
      icon: BarChart3,
      label: 'Ventas Hoy',
      value: formatCurrency(totalToday),
      change: `${ordersToday.length} pedidos`,
      color: 'text-orange-600'
    },
  ];

  // Últimos 4 pedidos
  const recentOrders = allOrders.slice(0, 4);

  const statusColors: Record<OrderStatus, BadgeVariant> = {
    received: 'info',
    preparing: 'warning',
    ready: 'success',
    en_route: 'info',
    delivered: 'success',
    cancelled: 'danger',
  };

  const statusLabels: Record<OrderStatus, string> = {
    received: 'Recibido',
    preparing: 'Preparando',
    ready: 'Listo',
    en_route: 'En Camino',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-2 mb-8 border-b">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'menu'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Gestión de Menú
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pedidos
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${stat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-emerald-600">{stat.change}</p>
                  </Card>
                );
              })}
            </div>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pedidos Recientes</h2>
              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">#{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">
                            {order.items.length} {order.items.length === 1 ? 'platillo' : 'platillos'} · {new Date(order.createdAt).toLocaleDateString('es-PE')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
                        <Badge variant={statusColors[order.status]} size="sm">
                          {statusLabels[order.status]}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No hay pedidos aún</p>
              )}
            </Card>
          </>
        )}

        {activeTab === 'menu' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Gestión de Platillos</h2>
              <Button>
                <Plus className="w-5 h-5 mr-2" />
                Agregar Platillo
              </Button>
            </div>

            <div className="grid gap-4">
              {menuItems.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-gray-600">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-lg font-bold text-emerald-600">
                          {formatCurrency(item.price)}
                        </span>
                        {item.isValidated && <Badge variant="success">Validado</Badge>}
                        {item.isVegetarian && <Badge variant="info">Vegetariano</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">
                        {item.macros.calories} kcal · {item.macros.protein}g P · {item.macros.carbs}g C · {item.macros.fat}g G
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Todos los Pedidos</h2>
            {allOrders.length > 0 ? (
              <div className="space-y-3">
                {allOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString('es-PE')} · {order.fulfillmentType === 'delivery' ? 'Delivery' : order.fulfillmentType === 'pickup' ? 'Recoger' : 'Comer aquí'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-gray-700 text-sm">{order.items.length} {order.items.length === 1 ? 'platillo' : 'platillos'}</p>
                      <p className="font-bold text-gray-900 min-w-[80px]">{formatCurrency(order.total)}</p>
                      <select
                        aria-label="Estado del pedido"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[140px]"
                        value={order.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value as OrderStatus;
                          try {
                            await updateOrderStatus(order.id, newStatus);
                            // Recargar pedidos
                            const updated = await fetchAllOrders();
                            setAllOrders(updated);
                          } catch (error) {
                            console.error('Error al actualizar estado:', error);
                            alert('Error al actualizar el estado del pedido');
                          }
                        }}
                      >
                        <option value="received">Recibido</option>
                        <option value="preparing">Preparando</option>
                        <option value="ready">Listo</option>
                        <option value="en_route">En Camino</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No hay pedidos registrados</p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};
