import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Building2, ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/utils/AuthContext';
import api from '@/utils/axiosConfig';

// ============================================================================
// CONSTANTES
// ============================================================================
const INITIAL_FORM_DATA = {
    nom: '',
    email: '',
    type_categorie_id: '',
};

const VALIDATION_RULES = {
    nom: {
        required: true,
        minLength: 2,
        messages: {
            required: 'Le nom de la compagnie est requis',
            minLength: 'Le nom doit contenir au moins 2 caractères'
        }
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        messages: {
            required: "L'email est requis",
            pattern: 'Veuillez saisir un email valide'
        }
    },
    type_categorie_id: {
        required: true,
        messages: {
            required: 'Veuillez sélectionner une catégorie'
        }
    }
};

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================
export default function Register() {
    // ------------------------------------------------------------------------
    // ÉTATS
    // ------------------------------------------------------------------------
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // ------------------------------------------------------------------------
    // HOOKS
    // ------------------------------------------------------------------------
    const navigate = useNavigate();
    const { error: authError, clearError } = useAuth();

    // ------------------------------------------------------------------------
    // EFFETS
    // ------------------------------------------------------------------------
    useEffect(() => {
        fetchCategories();
    }, []);

    // ------------------------------------------------------------------------
    // FONCTIONS UTILITAIRES
    // ------------------------------------------------------------------------
    const fetchCategories = async () => {
        try {
            const response = await api.get('/type-categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des catégories:', error);
            setErrors({ general: 'Erreur lors du chargement des catégories.' });
        } finally {
            setLoadingCategories(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validation du nom
        const { nom, email, type_categorie_id } = formData;
        const nomTrimmed = nom.trim();

        if (!nomTrimmed) {
            newErrors.nom = VALIDATION_RULES.nom.messages.required;
        } else if (nomTrimmed.length < VALIDATION_RULES.nom.minLength) {
            newErrors.nom = VALIDATION_RULES.nom.messages.minLength;
        }

        // Validation de l'email
        const emailTrimmed = email.trim();
        if (!emailTrimmed) {
            newErrors.email = VALIDATION_RULES.email.messages.required;
        } else if (!VALIDATION_RULES.email.pattern.test(emailTrimmed)) {
            newErrors.email = VALIDATION_RULES.email.messages.pattern;
        }

        // Validation de la catégorie
        if (!type_categorie_id) {
            newErrors.type_categorie_id = VALIDATION_RULES.type_categorie_id.messages.required;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        setSuccess('');
    };

    const formatSuccessMessage = (data) => {
        return `Compte créé avec succès !\nCMPID: ${data.CMPID}\nEmail: ${data.compagnie.email}\nCatégorie: ${data.compagnie.categorie.nom}\n\nVérifiez vos emails pour recevoir vos identifiants de connexion.`;
    };

    const redirectToLogin = () => {
        navigate('/login'); // redirection directe sans délai
    };


    // ------------------------------------------------------------------------
    // GESTIONNAIRES D'ÉVÉNEMENTS
    // ------------------------------------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Supprimer l'erreur pour ce champ s'il existe
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (value) => {
        setFormData(prev => ({ ...prev, type_categorie_id: value }));

        // Supprimer l'erreur pour ce champ s'il existe
        if (errors.type_categorie_id) {
            setErrors(prev => ({ ...prev, type_categorie_id: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});
        setSuccess('');
        clearError();

        try {
            const registrationData = {
                nom: formData.nom.trim(),
                email: formData.email.trim(),
                type_categorie_id: parseInt(formData.type_categorie_id),
            };

            const response = await api.post('/Inscription', registrationData);

            setSuccess(formatSuccessMessage(response.data));
            resetForm();
            redirectToLogin();

        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                authError ||
                "Erreur lors de l'inscription.";
            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/login');
    };

    // ------------------------------------------------------------------------
    // RENDU
    // ------------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-white">
            <Header onCancel={handleCancel} />

            <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-md space-y-6">
                    <PageTitle />

                    <AlertMessages success={success} errors={errors} />

                    <RegistrationForm
                        formData={formData}
                        errors={errors}
                        isLoading={isLoading}
                        categories={categories}
                        loadingCategories={loadingCategories}
                        onSubmit={handleSubmit}
                        onChange={handleChange}
                        onSelectChange={handleSelectChange}
                        onCancel={handleCancel}
                    />

                    <LoginLink onNavigate={() => navigate('/login')} />
                </div>
            </main>
        </div>
    );
}

// ============================================================================
// SOUS-COMPOSANTS
// ============================================================================

// ------------------------------------------------------------------------
// Header
// ------------------------------------------------------------------------
const Header = ({ onCancel }) => (
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
            onClick={onCancel}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
        >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Retour</span>
        </button>
    </header>
);

// ------------------------------------------------------------------------
// Titre de la page
// ------------------------------------------------------------------------
const PageTitle = () => (
    <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-black">
            Inscription Compagnie
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
            Créez votre compte compagnie pour commencer
        </p>
    </div>
);

// ------------------------------------------------------------------------
// Messages d'alerte
// ------------------------------------------------------------------------
const AlertMessages = ({ success, errors }) => (
    <>
        {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-green-800 text-sm font-medium">Succès!</p>
                        <p className="text-green-700 text-sm whitespace-pre-line mt-1">
                            {success}
                        </p>
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
    </>
);

// ------------------------------------------------------------------------
// Formulaire d'inscription
// ------------------------------------------------------------------------
const RegistrationForm = ({
    formData,
    errors,
    isLoading,
    categories,
    loadingCategories,
    onSubmit,
    onChange,
    onSelectChange,
    onCancel
}) => (
    <form onSubmit={onSubmit} className="space-y-4">
        <CompanyNameField
            value={formData.nom}
            error={errors.nom}
            onChange={onChange}
            disabled={isLoading}
        />

        <EmailField
            value={formData.email}
            error={errors.email}
            onChange={onChange}
            disabled={isLoading}
        />

        <CategoryField
            value={formData.type_categorie_id}
            error={errors.type_categorie_id}
            categories={categories}
            loadingCategories={loadingCategories}
            onSelectChange={onSelectChange}
            disabled={isLoading}
        />

        <FormButtons
            isLoading={isLoading}
            loadingCategories={loadingCategories}
            onCancel={onCancel}
        />
    </form>
);

// ------------------------------------------------------------------------
// Champ nom de compagnie
// ------------------------------------------------------------------------
const CompanyNameField = ({ value, error, onChange, disabled }) => (
    <div className="space-y-2">
        <Label htmlFor="nom" className="text-sm font-medium text-black">
            Nom de la compagnie <span className="text-red-500">*</span>
        </Label>
        <Input
            id="nom"
            name="nom"
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Entrez le nom de votre compagnie"
            className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            disabled={disabled}
        />
        {error && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
            </p>
        )}
    </div>
);

// ------------------------------------------------------------------------
// Champ email
// ------------------------------------------------------------------------
const EmailField = ({ value, error, onChange, disabled }) => (
    <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-black">
            Email <span className="text-red-500">*</span>
        </Label>
        <Input
            id="email"
            name="email"
            type="email"
            value={value}
            onChange={onChange}
            placeholder="exemple@compagnie.com"
            className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            disabled={disabled}
        />
        {error && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
            </p>
        )}
    </div>
);

// ------------------------------------------------------------------------
// Champ catégorie
// ------------------------------------------------------------------------
const CategoryField = ({
    value,
    error,
    categories,
    loadingCategories,
    onSelectChange,
    disabled
}) => (
    <div className="space-y-2">
        <Label htmlFor="type_categorie_id" className="text-sm font-medium text-black">
            Catégorie d'activité <span className="text-red-500">*</span>
        </Label>
        <Select
            name="type_categorie_id"
            onValueChange={onSelectChange}
            disabled={disabled || loadingCategories}
            value={value}
        >
            <SelectTrigger className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue
                    placeholder={
                        loadingCategories ? "Chargement..." : "Sélectionnez une catégorie"
                    }
                />
            </SelectTrigger>
            <SelectContent>
                {categories.map((categorie) => (
                    <SelectItem key={categorie.id} value={categorie.id.toString()}>
                        {categorie.nom}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        {error && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
            </p>
        )}
    </div>
);

// ------------------------------------------------------------------------
// Boutons du formulaire
// ------------------------------------------------------------------------
const FormButtons = ({ isLoading, loadingCategories, onCancel }) => (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
        >
            Annuler
        </Button>
        <Button
            type="submit"
            className="flex-1 h-11 bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isLoading || loadingCategories}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Inscription...
                </div>
            ) : (
                'Créer le compte'
            )}
        </Button>
    </div>
);

// ------------------------------------------------------------------------
// Lien vers la connexion
// ------------------------------------------------------------------------
const LoginLink = ({ onNavigate }) => (
    <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
            Vous avez déjà un compte?{' '}
            <button
                onClick={onNavigate}
                className="text-orange-500 hover:text-orange-600 font-medium hover:underline"
            >
                Se connecter
            </button>
        </p>
    </div>
);