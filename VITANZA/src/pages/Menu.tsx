import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MenuItemCard } from '../components/MenuItemCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useMenu } from '../hooks/useMenu';
import { useAuth } from '../context/AuthContext';
import { MenuItem } from '../types';

export const Menu = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showValidatedOnly, setShowValidatedOnly] = useState(false);
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const navigate = useNavigate();

  // Bloquear acceso a ADMIN
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Obtener items desde Supabase
  const { items: menuItems, isLoading, error } = useMenu();

  const categories = ['all', ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesValidated = !showValidatedOnly || item.isValidated;
    const matchesVegetarian = !showVegetarianOnly || item.isVegetarian;

    return matchesSearch && matchesCategory && matchesValidated && matchesVegetarian;
  });

  const handleItemClick = (item: MenuItem) => {
    navigate(`/menu/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nuestro Menú</h1>
          <p className="text-lg text-gray-600">
            Explora nuestros platillos con macros validados por nutricionistas
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="text"
              placeholder="Buscar platillos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Seleccionar categoría"
            >
              <option value="all">Todas las categorías</option>
              {categories.filter((c) => c !== 'all').map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={showValidatedOnly}
                onChange={(e) => setShowValidatedOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Solo validados</span>
            </label>

            <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={showVegetarianOnly}
                onChange={(e) => setShowVegetarianOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Solo vegetariano</span>
            </label>
          </div>

          {(searchTerm || selectedCategory !== 'all' || showValidatedOnly || showVegetarianOnly) && (
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setShowValidatedOnly(false);
                  setShowVegetarianOnly(false);
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="text-gray-600 text-lg mt-4">Cargando menú...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No se encontraron platillos con los filtros seleccionados
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Mostrando {filteredItems.length} de {menuItems.length} platillos
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onClick={handleItemClick} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
