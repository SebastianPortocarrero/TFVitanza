import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
    error: string;
    onRetry?: () => void;
    onDismiss?: () => void;
}

export const ErrorAlert = ({ error, onRetry, onDismiss }: ErrorAlertProps) => {
    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-sm text-red-700">{error}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium underline"
                        >
                            Intentar de nuevo
                        </button>
                    )}
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-red-500 hover:text-red-700 ml-2"
                        aria-label="Cerrar alerta"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};
