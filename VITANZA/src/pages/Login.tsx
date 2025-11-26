import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ErrorAlert } from '../components/ErrorAlert';
import { validateEmail } from '../utils/validation';
import { getAuthErrorMessage } from '../utils/errorHandler';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Por favor ingresa un email válido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    // Validaciones
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Por favor ingresa un email válido');
      return;
    }

    try {
      await login(email, password);

      // Redirigir según el rol del usuario
      // Nota: user se actualiza después del login, así que usamos una pequeña espera
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('vitanza_user') || '{}');
        if (currentUser.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 100);
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-3xl">V</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido a VITANZA</h1>
          <p className="text-gray-600">Ingresa a tu cuenta para continuar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Correo Electrónico"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              onBlur={handleEmailBlur}
              error={emailError}
              autoComplete="email"
              required
            />

            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {error && (
              <ErrorAlert
                error={error}
                onDismiss={() => setError('')}
              />
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Ingresar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Prueba con <span className="font-semibold">admin@vitanza.pe</span> para ver el panel
              de administración
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
