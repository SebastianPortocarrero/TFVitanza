import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Dumbbell, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { FitnessGoal } from '../types';

export const Onboarding = () => {
  const [goal, setGoal] = useState<FitnessGoal | null>(null);
  const navigate = useNavigate();

  const goals = [
    {
      id: 'muscle_gain' as FitnessGoal,
      icon: Dumbbell,
      title: 'Ganar Músculo',
      description: 'Aumenta tu masa muscular con comidas altas en proteína',
    },
    {
      id: 'fat_loss' as FitnessGoal,
      icon: Target,
      title: 'Perder Grasa',
      description: 'Alcanza tu peso ideal con déficit calórico controlado',
    },
    {
      id: 'performance' as FitnessGoal,
      icon: Zap,
      title: 'Alto Rendimiento',
      description: 'Optimiza tu energía para entrenamientos intensos',
    },
  ];

  const handleContinue = () => {
    if (goal) {
      localStorage.setItem('vitanza_goal', goal);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Cuál es tu objetivo fitness?
          </h1>
          <p className="text-lg text-gray-600">
            Selecciona tu meta para personalizar tu experiencia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {goals.map((g) => {
            const Icon = g.icon;
            const isSelected = goal === g.id;

            return (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={`bg-white rounded-2xl p-8 text-center transition-all duration-200 ${
                  isSelected
                    ? 'ring-4 ring-emerald-500 shadow-xl'
                    : 'hover:shadow-lg border-2 border-transparent hover:border-emerald-200'
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isSelected
                      ? 'bg-emerald-600'
                      : 'bg-gray-100'
                  }`}
                >
                  <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{g.title}</h3>
                <p className="text-gray-600 text-sm">{g.description}</p>
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            disabled={!goal}
            onClick={handleContinue}
            className="px-12"
          >
            Continuar
          </Button>
          <button
            onClick={() => navigate('/dashboard')}
            className="block mx-auto mt-4 text-gray-600 hover:text-gray-800 text-sm"
          >
            Omitir por ahora
          </button>
        </div>
      </div>
    </div>
  );
};
