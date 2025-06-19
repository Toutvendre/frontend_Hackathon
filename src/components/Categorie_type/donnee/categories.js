import {
    Search, Plane, Car, Train, Bus, Ambulance, MapPin, Heart, Stethoscope,
    Pill, Hospital, UserCheck, Shield, Utensils, Shirt, Users, Calculator
} from 'lucide-react';

export const CATEGORIES_DATA = {
    Transport: {
        subcategories: [
            { name: 'Aérienne', icon: Plane, description: 'Vols, compagnies aériennes' },
            { name: 'Routier', icon: Car, description: 'Bus, voitures, routes' },
            { name: 'Ferroviaire', icon: Train, description: 'Trains, gares' },
            { name: 'Taxis', icon: Bus, description: 'Services de taxi' },
            { name: 'Ambulance', icon: Ambulance, description: 'Services d\'urgence' },
            { name: 'Location véhicule', icon: MapPin, description: 'Location de voitures' }
        ]
    },
    Santé: {
        subcategories: [
            { name: 'Consultation', icon: Stethoscope, description: 'Rendez-vous médicaux' },
            { name: 'Pharmacie', icon: Pill, description: 'Médicaments, ordonnances' },
            { name: 'Hôpitaux', icon: Hospital, description: 'Centres hospitaliers' },
            { name: 'Spécialistes', icon: UserCheck, description: 'Médecins spécialisés' },
            { name: 'Urgences', icon: Shield, description: 'Services d\'urgence' },
            { name: 'Prévention', icon: Heart, description: 'Santé préventive' }
        ]
    },
    Restaurant: {
        subcategories: [
            { name: 'Fast Food', icon: Utensils, description: 'Restauration rapide' },
            { name: 'Cuisine Locale', icon: Utensils, description: 'Plats traditionnels' },
            { name: 'Livraison', icon: Car, description: 'Commande à domicile' },
            { name: 'Fine Dining', icon: Utensils, description: 'Restaurants gastronomiques' },
            { name: 'Café & Bar', icon: Utensils, description: 'Boissons et collations' },
            { name: 'Traiteur', icon: Users, description: 'Services de traiteur' }
        ]
    },
    Vêtement: {
        subcategories: [
            { name: 'Mode Homme', icon: Shirt, description: 'Vêtements masculins' },
            { name: 'Mode Femme', icon: Shirt, description: 'Vêtements féminins' },
            { name: 'Mode Enfant', icon: Shirt, description: 'Vêtements enfants' },
            { name: 'Chaussures', icon: Shirt, description: 'Tous types de chaussures' },
            { name: 'Accessoires', icon: Shirt, description: 'Sacs, bijoux, montres' },
            { name: 'Sport', icon: Shirt, description: 'Vêtements de sport' }
        ]
    },
    Élément: {
        subcategories: [
            { name: 'Électronique', icon: Calculator, description: 'Appareils électroniques' },
            { name: 'Électroménager', icon: Calculator, description: 'Appareils ménagers' },
            { name: 'Informatique', icon: Calculator, description: 'Ordinateurs, logiciels' },
            { name: 'Téléphonie', icon: Calculator, description: 'Téléphones, accessoires' },
            { name: 'Audio/Vidéo', icon: Calculator, description: 'Son et image' },
            { name: 'Gaming', icon: Calculator, description: 'Jeux vidéo, consoles' }
        ]
    }
};
