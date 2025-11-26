import { ArrowRight, CheckCircle, Leaf, QrCode, Trophy, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '../components/Button';
import { TikTokIcon } from '../components/icons/TikTokIcon';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirigir usuarios autenticados a su dashboard correspondiente
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const features = [
    {
      icon: CheckCircle,
      title: 'Macros Validados',
      description: 'Todos nuestros platillos están validados por nutricionistas certificados',
    },
    {
      icon: Leaf,
      title: 'Personalización Total',
      description: 'Ajusta proteína, carbohidratos y fibra según tus necesidades',
    },
    {
      icon: QrCode,
      title: 'Exporta tus Macros',
      description: 'Escanea el QR y sincroniza con MyFitnessPal o Cronometer',
    },
    {
      icon: Trophy,
      title: 'Desafíos y Recompensas',
      description: 'Participa en retos fitness y gana puntos por cada compra',
    },
  ];

  const socialMedia = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/vitanza_restobarfit",
      bgColor: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
      hoverColor: "hover:opacity-90",
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      url: "https://www.tiktok.com/@vitanzafood",
      bgColor: "bg-[#000000]",
      hoverColor: "hover:bg-[#000000]/90",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Comida saludable con macros que puedes confiar
              </h1>
              <p className="text-xl mb-8 text-emerald-50">
                Macros visibles y confiables, validadas por nutricionistas. Personaliza tu plato
                en 1 toque y alcanza tus objetivos fitness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/menu')}
                  className="!bg-white !text-black hover:!bg-slate-700 hover:!text-white !border-2 !border-slate-300 hover:!border-slate-700 font-semibold px-8 flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Ver Menú
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/register')}
                  className="border-2 border-white text-white hover:bg-white hover:text-emerald-700 font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Registrarse
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Comida saludable"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir VITANZA?
            </h2>
            <p className="text-xl text-gray-600">
              La mejor experiencia en comida saludable para atletas y profesionales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="text-center p-6 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Tu pedido estará listo en minutos
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Ordena online y recibe tu comida saludable en tiempo récord. Ofrecemos delivery,
                  pickup y reservas para comer en nuestro local.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                    Preparación en 10-20 minutos
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                    Delivery rápido en Lima
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                    Planes semanales y mensuales disponibles
                  </li>
                </ul>
                <Button size="lg" onClick={() => navigate('/menu')}>
                  Hacer mi primer pedido
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Platillo 1"
                  className="rounded-xl shadow-lg"
                />
                <img
                  src="https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Platillo 2"
                  className="rounded-xl shadow-lg mt-8"
                />
                <img
                  src="https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Platillo 3"
                  className="rounded-xl shadow-lg"
                />
                <img
                  src="https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Platillo 4"
                  className="rounded-xl shadow-lg mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Empieza tu viaje hacia una vida más saludable
          </h2>
          <p className="text-xl text-emerald-50 mb-8">
            Únete a miles de peruanos que ya confían en VITANZA para alcanzar sus metas fitness
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/register')}
            className="!bg-white !text-black hover:!bg-slate-700 hover:!text-white !border-2 !border-slate-300 hover:!border-slate-700 font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Crear mi cuenta gratis
          </Button>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Síguenos en nuestras redes
            </h2>
            <p className="text-lg text-gray-600">
              Mantente al día con nuestras últimas novedades, recetas y promociones
            </p>
          </div>

          <div className="flex flex-col gap-4 max-w-md mx-auto">
            {socialMedia.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.bgColor} ${social.hoverColor} text-white rounded-xl p-4 flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-semibold text-lg">{social.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
