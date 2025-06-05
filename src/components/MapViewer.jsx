// src/components/EventMapView.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue with Webpack/CRA
delete L.Icon.Default.prototype._get // eslint-disable-line no-underscore-dangle
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png', // Ini akan mengacu ke public/images/marker-icon-2x.png
  iconUrl: '/images/marker-icon.png',         // Ini akan mengacu ke public/images/marker-icon.png
  shadowUrl: '/images/marker-shadow.png',
});

const EventMapView = ({ latitude, longitude, locationName }) => {
  if (!latitude || !longitude) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 rounded-md">
        Lokasi peta tidak tersedia.
      </div>
    );
  }

  const position = [latitude, longitude];

  return (
    <div className="w-full h-96 rounded-md shadow-md overflow-hidden">
      <MapContainer 
        center={position} 
        zoom={15} // Zoom in closer for event location
        scrollWheelZoom={false} // Disable scroll zoom to prevent accidental zooming
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} title={locationName} />
      </MapContainer>
    </div>
  );
};

export default EventMapView;