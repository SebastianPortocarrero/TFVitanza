import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Minus, Plus, ShoppingCart } from 'lucide-react';
import { customizationRules, nutritionists } from '../utils/mockData';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { MacroDisplay } from '../components/MacroDisplay';
import { formatCurrency, formatTime } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useMenuItem } from '../hooks/useMenuItem';
import { CustomizationRule, Macros } from '../types';

export const MenuItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  // Bloquear acceso a ADMIN
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Obtener item desde Supabase
  const { item, isLoading, error } = useMenuItem(id || '');
  const [selectedCustomizations, setSelectedCustomizations] = useState<CustomizationRule[]>([]);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600 text-lg mt-4">Cargando platillo...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Platillo no encontrado'}
          </h2>
          <Button onClick={() => navigate('/menu')}>Volver al menú</Button>
        </div>
      </div>
    );
  }

  const nutritionist = item.validatedBy
    ? nutritionists.find((n) => n.id === item.validatedBy)
    : null;

  const calculateCustomizedMacros = (): Macros => {
    const result = { ...item.macros };
    selectedCustomizations.forEach((custom) => {
      if (custom.macroModifier.calories) result.calories += custom.macroModifier.calories;
      if (custom.macroModifier.protein) result.protein += custom.macroModifier.protein;
      if (custom.macroModifier.carbs) result.carbs += custom.macroModifier.carbs;
      if (custom.macroModifier.fat) result.fat += custom.macroModifier.fat;
      if (custom.macroModifier.fiber && result.fiber !== undefined) {
        result.fiber += custom.macroModifier.fiber;
      }
    });
    return result;
  };

  const calculatePrice = (): number => {
    return selectedCustomizations.reduce(
      (total, custom) => total + custom.priceModifier,
      item.price
    );
  };

  const customizedMacros = calculateCustomizedMacros();
  const finalPrice = calculatePrice();

  const toggleCustomization = (rule: CustomizationRule) => {
    setSelectedCustomizations((prev) => {
      const exists = prev.find((r) => r.id === rule.id);
      if (exists) {
        return prev.filter((r) => r.id !== rule.id);
      }
      return [...prev, rule];
    });
  };

  const handleAddToCart = () => {
    addItem(item, selectedCustomizations, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate('/menu')} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al menú
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="relative mb-6">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              {item.isValidated && (
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              )}
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ingredientes</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {item.ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="default">
                    {ingredient}
                  </Badge>
                ))}
              </div>

              {item.allergens.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Alérgenos</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.allergens.map((allergen) => (
                      <Badge key={allergen} variant="warning">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </Card>

            {nutritionist && (
              <Card className="p-6 mt-6">
                <div className="flex items-start gap-4">
                  <img
                    src={nutritionist.photo}
                    alt={nutritionist.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-gray-900">Validado por</span>
                    </div>
                    <p className="text-gray-900 font-medium">{nutritionist.name}</p>
                    <p className="text-sm text-gray-600">{nutritionist.license}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{item.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{item.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                {formatTime(item.preparationTime)}
              </div>
              {item.isVegetarian && <Badge variant="success">Vegetariano</Badge>}
              {item.isGlutenFree && <Badge variant="info">Sin Gluten</Badge>}
            </div>

            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Información Nutricional
              </h3>
              <MacroDisplay macros={customizedMacros} size="lg" vertical />
              {selectedCustomizations.length > 0 && (
                <p className="text-sm text-emerald-600 mt-3">
                  Macros actualizados con tus personalizaciones
                </p>
              )}
            </Card>

            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Personaliza tu platillo
              </h3>
              <div className="space-y-3">
                {customizationRules.map((rule) => {
                  const isSelected = selectedCustomizations.some((r) => r.id === rule.id);
                  return (
                    <button
                      type="button"
                      key={rule.id}
                      onClick={() => toggleCustomization(rule)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{rule.label}</p>
                          {rule.priceModifier > 0 && (
                            <p className="text-sm text-gray-600">
                              +{formatCurrency(rule.priceModifier)}
                            </p>
                          )}
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-medium text-gray-700">Cantidad</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Disminuir cantidad"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-emerald-500 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Aumentar cantidad"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-emerald-500 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex items-center justify-between text-2xl font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-emerald-600">{formatCurrency(finalPrice * quantity)}</span>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al carrito
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
