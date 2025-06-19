import React, { createContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { TOAST_TYPES, TOAST_STYLES } from './ToastUtils';

const ToastContext = createContext();

const Toast = ({ id, type, title, message, onClose, autoClose = true, duration = 5000 }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isRemoving, setIsRemoving] = React.useState(false);
    const timeoutRef = React.useRef();

    const style = TOAST_STYLES[type] || TOAST_STYLES.info;
    const Icon = style.icon;

    const handleClose = React.useCallback(() => {
        setIsRemoving(true);
        setTimeout(() => {
            onClose(id);
        }, 300);
    }, [onClose, id]);

    React.useEffect(() => {
        setIsVisible(true);

        if (autoClose) {
            timeoutRef.current = setTimeout(() => {
                handleClose();
            }, duration);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [autoClose, duration, handleClose]);

    return (
        <div
            className={`
                transform transition-all duration-300 ease-in-out mb-3
                ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                ${style.bg} ${style.border} border rounded-lg shadow-lg p-4 min-w-[320px] max-w-md
            `}
        >
            <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${style.iconColor} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                    {title && (
                        <h4 className={`font-medium ${style.text} text-sm mb-1`}>
                            {title}
                        </h4>
                    )}
                    <p className={`${style.text} text-sm ${title ? 'opacity-90' : ''}`}>
                        {message}
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className={`${style.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
            <div className="flex flex-col items-end space-y-2 pointer-events-auto">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: toast.type || TOAST_TYPES.INFO,
            title: toast.title,
            message: toast.message,
            autoClose: toast.autoClose !== false,
            duration: toast.duration || 5000
        };

        setToasts(prev => [...prev, newToast]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    const toast = {
        success: (message, options = {}) => addToast({
            type: TOAST_TYPES.SUCCESS,
            message,
            ...options
        }),
        error: (message, options = {}) => addToast({
            type: TOAST_TYPES.ERROR,
            message,
            ...options
        }),
        warning: (message, options = {}) => addToast({
            type: TOAST_TYPES.WARNING,
            message,
            ...options
        }),
        info: (message, options = {}) => addToast({
            type: TOAST_TYPES.INFO,
            message,
            ...options
        }),
        custom: addToast
    };

    const value = {
        toast,
        removeToast,
        clearToasts
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export { ToastContext };