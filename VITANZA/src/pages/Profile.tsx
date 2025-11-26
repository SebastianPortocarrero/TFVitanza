import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { FitnessGoal } from '../types';

export const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [goal, setGoal] = useState<FitnessGoal>(
    (localStorage.getItem('vitanza_goal') as FitnessGoal) || 'muscle_gain'
  );
  const [weight, setWeight] = useState('75');
  const [height, setHeight] = useState('175');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Ocultar mensaje de éxito después de 3 segundos
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Redirect si no hay usuario
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    setError('');

    try {
      // Actualizar perfil en Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: name,
          goal: goal,
          weight: weight ? parseFloat(weight) : null,
          height: height ? parseFloat(height) : null,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Guardar objetivo en localStorage
      localStorage.setItem('vitanza_goal', goal);

      // Mostrar notificación de éxito
      setShowSuccess(true);

      // Recargar la página para actualizar el contexto
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error('Error al guardar perfil:', err);
      setError('Error al guardar los cambios. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const goals: { id: FitnessGoal; label: string }[] = [
    { id: 'muscle_gain', label: 'Ganar Músculo' },
    { id: 'fat_loss', label: 'Perder Grasa' },
    { id: 'performance', label: 'Alto Rendimiento' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al dashboard
        </Button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Información Personal
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Nombre Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Correo Electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Objetivo Fitness
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${goal === g.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-300'
                    }`}
                >
                  <p className="font-semibold text-gray-900">{g.label}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Métricas Físicas
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Peso (kg)"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <Input
                label="Altura (cm)"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Restricciones Dietéticas
            </h2>
            <div className="space-y-3">
              {['Vegetariano', 'Vegano', 'Sin Gluten', 'Sin Lácteos', 'Sin Frutos Secos'].map(
                (restriction) => (
                  <label
                    key={restriction}
                    className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:border-emerald-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-gray-900">{restriction}</span>
                  </label>
                )
              )}
            </div>
          </Card>

          {/* Notificación de éxito */}
          {showSuccess && (
            <div className="fixed top-4 right-4 z-50 animate-slide-in">
              <div className="bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Perfil actualizado</p>
                  <p className="text-sm text-emerald-100">Tus cambios se guardaron correctamente</p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button size="lg" onClick={handleSave} isLoading={isSaving}>
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
