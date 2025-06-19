import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ChevronLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../utils/AuthContext";
import { getDashboardRedirectUrl } from "@/utils/categorie/categoryRedirection";

export default function LoginPage() {
    const [cmpid, setCmpid] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [errors, setErrors] = useState({});
    const [redirecting, setRedirecting] = useState(false);
    const { login, loading, error, clearError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading || redirecting) return;

        setErrors({});
        clearError();

        const newErrors = {};
        if (!cmpid.trim()) {
            newErrors.cmpid = "Le CMPID est requis";
        } else if (cmpid.trim().length < 3) {
            newErrors.cmpid = "Le CMPID doit contenir au moins 3 caractères";
        }
        if (!motDePasse.trim()) {
            newErrors.motDePasse = "Le mot de passe est requis";
        } else if (motDePasse.length < 6) {
            newErrors.motDePasse = "Le mot de passe doit contenir au moins 6 caractères";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await login(cmpid.trim(), motDePasse);
            if (response && response.compagnie) {
                const compagnie = response.compagnie;
                setRedirecting(true);
                const redirectUrl = await getDashboardRedirectUrl(compagnie);
                setTimeout(() => {
                    navigate(redirectUrl);
                }, 500);
            } else {
                setErrors({ general: 'Erreur de connexion inattendue' });
            }
        } catch (err) {
            setRedirecting(false);
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors || {};
                setErrors({
                    cmpid: serverErrors.cmpid?.[0] || '',
                    motDePasse: serverErrors.motDePasse?.[0] || '',
                    general: serverErrors.message || 'Les données fournies sont invalides',
                });
            } else {
                setErrors({ general: err.response?.data?.message || 'Erreur de connexion' });
            }
        }
    };

    const handleChange = (field, value) => {
        if (field === 'cmpid') {
            setCmpid(value);
        } else if (field === 'motDePasse') {
            setMotDePasse(value);
        }

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const isLoading = loading || redirecting;

    return (
        <div className="min-h-screen bg-white">
            <header className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-black">
                        Assistant Digitale
                    </h1>
                </div>
                <button
                    onClick={() => navigate('/register')}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
                    disabled={isLoading}
                >
                    <span className="hidden sm:inline">S'inscrire</span>
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                </button>
            </header>

            <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-black">
                            Connexion
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            Connectez-vous pour accéder à votre compte
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-red-800 text-sm font-medium">Erreur</p>
                                    <p className="text-red-700 text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-red-800 text-sm font-medium">Erreur</p>
                                    <p className="text-red-700 text-sm mt-1">{errors.general}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {redirecting && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin mt-0.5 flex-shrink-0"></div>
                                <div>
                                    <p className="text-green-800 text-sm font-medium">Connexion réussie!</p>
                                    <p className="text-green-700 text-sm mt-1">Redirection vers votre dashboard...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cmpid" className="text-sm font-medium text-black">
                                CMPID <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="cmpid"
                                name="cmpid"
                                type="text"
                                value={cmpid}
                                onChange={(e) => handleChange('cmpid', e.target.value)}
                                placeholder="Entrez votre CMPID"
                                className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                disabled={isLoading}
                            />
                            {errors.cmpid && (
                                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.cmpid}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="motDePasse" className="text-sm font-medium text-black">
                                Mot de passe <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="motDePasse"
                                name="motDePasse"
                                type="password"
                                value={motDePasse}
                                onChange={(e) => handleChange('motDePasse', e.target.value)}
                                placeholder="Entrez votre mot de passe"
                                className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                disabled={isLoading}
                            />
                            {errors.motDePasse && (
                                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.motDePasse}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium"
                            disabled={isLoading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Connexion...
                                </div>
                            ) : redirecting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Redirection...
                                </div>
                            ) : (
                                'Se connecter'
                            )}
                        </Button>
                    </form>

                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Vous n'avez pas de compte?{' '}
                                <button
                                    onClick={() => navigate('/register')}
                                    className="text-orange-500 hover:text-orange-600 font-medium hover:underline"
                                    disabled={isLoading}
                                >
                                    S'inscrire
                                </button>
                            </p>
                        </div>

                        <div className="text-center">
                            <a
                                href="/password/reset"
                                className={`text-sm text-orange-500 hover:text-orange-600 font-medium hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                Mot de passe oublié ?
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}