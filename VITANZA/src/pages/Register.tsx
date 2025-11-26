import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ErrorAlert } from '../components/ErrorAlert';
import { validateEmail, validatePassword } from '../utils/validation';
import { getAuthErrorMessage } from '../utils/errorHandler';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Por favor ingresa un email válido');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordBlur = () => {
    if (password) {
      const validation = validatePassword(password);
      setPasswordErrors(validation.errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordErrors([]);

    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Por favor ingresa un email válido');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordErrors(passwordValidation.errors);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/onboarding');
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-3xl">V</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Únete a VITANZA</h1>
          <p className="text-gray-600">Comienza tu viaje hacia una alimentación saludable</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              label="Nombre Completo"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />

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

            <div>
              <Input
                type="password"
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordErrors.length > 0) setPasswordErrors([]);
                }}
                onBlur={handlePasswordBlur}
                autoComplete="new-password"
                required
              />
              {passwordErrors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordErrors.map((err, idx) => (
                    <p key={idx} className="text-xs text-red-600">• {err}</p>
                  ))}
                </div>
              )}
              {password && passwordErrors.length === 0 && (
                <p className="mt-1 text-xs text-green-600">✓ Contraseña segura</p>
              )}
            </div>

            <Input
              type="password"
              label="Confirmar Contraseña"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />

            {error && (
              <ErrorAlert
                error={error}
                onDismiss={() => setError('')}
              />
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Crear Cuenta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Ingresa aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
