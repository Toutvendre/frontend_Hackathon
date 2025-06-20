// src/components/LivraisonMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow
});

const LivraisonMap = ({ livraison, onLocationChange }) => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        if (livraison) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const coords = {
                        lat: latitude,
                        lng: longitude,
                        formatted: `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`
                    };
                    setLocation(coords);
                    onLocationChange(coords);
                },
                (error) => {
                    console.error('Erreur GPS :', error);
                    setLocation(null);
                    onLocationChange(null);
                }
            );
        } else {
            setLocation(null);
            onLocationChange(null);
        }
    }, [livraison, onLocationChange]);

    if (!livraison || !location) return null;

    return (
        <div className="mt-2">
            <MapContainer center={location} zoom={15} style={{ height: '300px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={location}>
                    <Popup>Votre position actuelle</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LivraisonMap;
