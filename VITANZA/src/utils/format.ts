export const formatCurrency = (amount: number): string => {
  return `S/ ${amount.toFixed(2)}`;
};

export const formatMacro = (value: number): string => {
  return `${Math.round(value)}g`;
};

export const formatCalories = (value: number): string => {
  return `${Math.round(value)} kcal`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
};
