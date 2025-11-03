import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = () => {
    localStorage.setItem('vitanza_goal', goal);
    alert('Perfil actualizado correctamente');
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
                  className={`p-4 rounded-lg border-2 transition-all ${
                    goal === g.id
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

          <div className="flex justify-end">
            <Button size="lg" onClick={handleSave}>
              <Save className="w-5 h-5 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
