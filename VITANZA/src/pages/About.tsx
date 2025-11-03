import { Award, Heart, Shield, Users } from 'lucide-react';
import { nutritionists } from '../utils/mockData';

export const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Transparencia',
      description: 'Macros reales y validados por profesionales certificados',
    },
    {
      icon: Heart,
      title: 'Salud Primero',
      description: 'Ingredientes frescos y recetas balanceadas nutricionalmente',
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Apoyo constante en tu viaje hacia un estilo de vida saludable',
    },
    {
      icon: Award,
      title: 'Excelencia',
      description: 'Calidad premium en cada platillo que preparamos',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Sobre VITANZA</h1>
          <p className="text-xl text-emerald-50">
            Somos más que un restaurante saludable. Somos tu aliado en el camino hacia tus
            objetivos fitness y de bienestar.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
              <div className="space-y-4 text-gray-700 text-lg">
                <p>
                  VITANZA nació en 2024 con una misión clara: hacer que la comida saludable sea
                  accesible, conveniente y confiable para todos los peruanos que buscan mejorar su
                  estilo de vida.
                </p>
                <p>
                  Nos dimos cuenta de que muchas personas luchaban por alcanzar sus metas fitness
                  porque no tenían acceso a información nutricional precisa. Por eso, decidimos
                  crear un restaurante donde cada platillo tiene macros validados por
                  nutricionistas certificados.
                </p>
                <p>
                  Hoy, servimos a miles de clientes cada mes, desde atletas profesionales hasta
                  profesionales ocupados que simplemente quieren comer mejor.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Cocina VITANZA"
                className="rounded-xl shadow-lg"
              />
              <img
                src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Equipo VITANZA"
                className="rounded-xl shadow-lg mt-8"
              />
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              Nuestros Valores
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="bg-white rounded-xl p-6 shadow-sm text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
              Nuestros Nutricionistas
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Trabajamos con profesionales certificados que validan cada platillo para garantizar
              que los macros sean precisos y confiables.
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {nutritionists.map((nutritionist) => (
                <div
                  key={nutritionist.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <img
                    src={nutritionist.photo}
                    alt={nutritionist.name}
                    className="w-full h-64 object-top object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                      {nutritionist.name}
                    </h3>
                    <p className="text-emerald-600 font-medium mb-3">{nutritionist.license}</p>
                    <p className="text-gray-700 mb-4">{nutritionist.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {nutritionist.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
