import { useEffect } from 'react';
import { Award, Clock, QrCode, ShoppingBag, TrendingUp, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { useUserChallenges } from '../hooks/useUserChallenges';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { formatCurrency } from '../utils/format';

export const Dashboard = () => {
  const { user } = useAuth();
  const { orders, isLoading } = useOrders();
  const { challenges, isLoading: challengesLoading } = useUserChallenges(user?.id);
  const navigate = useNavigate();

  // Redirect ADMIN a su panel
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin');
    } else if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role === 'ADMIN') {
    return null;
  }

  if (isLoading || challengesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600 text-lg mt-4">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Estadísticas reales basadas en pedidos
  const totalOrders = orders.length;
  const totalPoints = totalOrders * 100; // 100 puntos por pedido

  const stats = [
    { icon: ShoppingBag, label: 'Pedidos Totales', value: totalOrders.toString(), color: 'text-blue-600' },
    { icon: Award, label: 'Puntos Acumulados', value: totalPoints.toLocaleString(), color: 'text-emerald-600' },
    { icon: TrendingUp, label: 'Racha Activa', value: '7 días', color: 'text-purple-600' },
    { icon: Clock, label: 'Próximo Pedido', value: 'No hay', color: 'text-gray-600' },
  ];

  // Obtener los últimos 3 pedidos
  const recentOrders = orders.slice(0, 3);

  // Función para formatear fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // Función para traducir status
  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      received: 'Recibido',
      preparing: 'Preparando',
      ready: 'Listo',
      en_route: 'En Camino',
      delivered: 'Entregado',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hola, {user.name}
          </h1>
          <p className="text-lg text-gray-600">
            Bienvenido a tu dashboard de VITANZA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Pedidos Recientes</h2>
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </div>

              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
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
                          <p className="font-semibold text-gray-900">Pedido #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">
                            {order.items.length} {order.items.length === 1 ? 'platillo' : 'platillos'} · {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
                        <Badge
                          variant={order.status === 'delivered' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tienes pedidos aún</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate('/menu')}
                    >
                      Hacer tu primer pedido
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Mis Desafíos Activos
              </h2>
              <div className="space-y-4">
                {challenges.length > 0 ? (
                  challenges.map((challenge) => {
                    const progress = (challenge.current / challenge.goal) * 100;
                    return (
                      <div key={challenge.id} className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                          </div>
                          <Badge variant="warning" size="sm">
                            {challenge.type === 'daily' && 'Diario'}
                            {challenge.type === 'weekly' && 'Semanal'}
                            {challenge.type === 'monthly' && 'Mensual'}
                          </Badge>
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              {challenge.current} / {challenge.goal}
                            </span>
                            <span className="text-emerald-600 font-semibold">
                              +{challenge.reward} puntos
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-emerald-600 h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay desafíos activos por el momento</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate('/profile')}>
                Ver Perfil
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
              <QrCode className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Exporta tus Macros</h3>
              <p className="text-emerald-50 text-sm mb-4">
                Escanea el QR de tu pedido para sincronizar con MyFitnessPal o Cronometer
              </p>
              <Button
                variant="secondary"
                className="w-full !bg-white !text-black hover:!bg-slate-700 hover:!text-white !border-2 !border-slate-300 hover:!border-slate-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/export')}
              >
                Ver Historial
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
              <Award className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nivel: Oro</h3>
              <p className="text-purple-50 text-sm mb-4">
                1,240 puntos acumulados. Solo 260 puntos más para Platino
              </p>
              <div className="w-full bg-purple-700 rounded-full h-2 mb-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '82%' }} />
              </div>
              <p className="text-xs text-purple-200">82% hacia el siguiente nivel</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
