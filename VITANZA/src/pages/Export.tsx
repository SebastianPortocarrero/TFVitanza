import { useState } from 'react';
import { ArrowLeft, Download, QrCode as QrCodeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { menuItems } from '../utils/mockData';

export const Export = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(menuItems[0]);
  const [showQR, setShowQR] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const generateQRData = () => {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      item_id: selectedItem.id,
      name: selectedItem.name,
      portion: '1 porción',
      calories: selectedItem.macros.calories,
      protein: selectedItem.macros.protein,
      carbs: selectedItem.macros.carbs,
      fat: selectedItem.macros.fat,
      fiber: selectedItem.macros.fiber,
      restaurant: 'VITANZA',
    });
  };

  const exportToCSV = () => {
    const csv = [
      ['Alimento', 'Calorías', 'Proteína (g)', 'Carbohidratos (g)', 'Grasa (g)', 'Fibra (g)'],
      [
        selectedItem.name,
        selectedItem.macros.calories,
        selectedItem.macros.protein,
        selectedItem.macros.carbs,
        selectedItem.macros.fat,
        selectedItem.macros.fiber || 0,
      ],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitanza-${selectedItem.name.toLowerCase().replace(/\s/g, '-')}.csv`;
    a.click();
  };

  const exportToJSON = () => {
    const data = {
      name: selectedItem.name,
      macros: selectedItem.macros,
      timestamp: new Date().toISOString(),
      restaurant: 'VITANZA',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitanza-${selectedItem.name.toLowerCase().replace(/\s/g, '-')}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al dashboard
        </Button>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Exportar Macros</h1>
        <p className="text-lg text-gray-600 mb-8">
          Exporta la información nutricional a tus apps de fitness favoritas
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Selecciona un Platillo
              </h2>
              <select
                aria-label='Seleccionar Platillo'
                value={selectedItem.id}
                onChange={(e) => {
                  const item = menuItems.find((i) => i.id === e.target.value);
                  if (item) setSelectedItem(item);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {menuItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Card>

            <Card className="p-6">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {selectedItem.name}
              </h3>
              <p className="text-gray-600 mb-4">{selectedItem.description}</p>

              <div className="bg-emerald-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Calorías</span>
                  <span className="font-semibold text-gray-900">
                    {selectedItem.macros.calories} kcal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Proteína</span>
                  <span className="font-semibold text-gray-900">
                    {selectedItem.macros.protein}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Carbohidratos</span>
                  <span className="font-semibold text-gray-900">
                    {selectedItem.macros.carbs}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Grasas</span>
                  <span className="font-semibold text-gray-900">
                    {selectedItem.macros.fat}g
                  </span>
                </div>
                {selectedItem.macros.fiber && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Fibra</span>
                    <span className="font-semibold text-gray-900">
                      {selectedItem.macros.fiber}g
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Código QR
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                Escanea este código con tu app de fitness para importar los datos
                automáticamente
              </p>

              {showQR ? (
                <div className="bg-white p-6 rounded-lg border-2 border-emerald-200 flex justify-center">
                  <QRCodeSVG value={generateQRData()} size={200} />
                </div>
              ) : (
                <button
                  onClick={() => setShowQR(true)}
                  className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 transition-colors flex flex-col items-center justify-center"
                >
                  <QrCodeIcon className="w-16 h-16 text-gray-400 mb-2" />
                  <span className="text-gray-600">Haz clic para generar QR</span>
                </button>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Exportar Archivo
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                Descarga los datos en formato CSV o JSON para importar manualmente
              </p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={exportToCSV}>
                  <Download className="w-5 h-5 mr-2" />
                  Descargar CSV
                </Button>
                <Button variant="outline" className="w-full" onClick={exportToJSON}>
                  <Download className="w-5 h-5 mr-2" />
                  Descargar JSON
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Cómo importar en MyFitnessPal
              </h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Abre MyFitnessPal y ve a "Diario"</li>
                <li>Toca el botón "Agregar alimento"</li>
                <li>Selecciona "Escanear código de barras"</li>
                <li>Escanea el QR generado</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
