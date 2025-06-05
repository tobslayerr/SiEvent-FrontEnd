// src/components/MapLocationPicker.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet"; // Import Leaflet library itself
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS for styling

// Fix for default marker icon issue with Webpack/CRA
delete L.Icon.Default.prototype._get // eslint-disable-line no-underscore-dangle
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png', // Ini akan mengacu ke public/images/marker-icon-2x.png
  iconUrl: '/images/marker-icon.png',         // Ini akan mengacu ke public/images/marker-icon.png
  shadowUrl: '/images/marker-shadow.png',
});

const MapLocationPicker = ({ onSelectLocation, initialLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(
    initialLocation || { lat: -6.2088, lng: 106.8456 } // Default ke Jakarta
  );
  const [addressInput, setAddressInput] = useState("");
  const [loadingGeocoding, setLoadingGeocoding] = useState(false);

  // Update marker position dan addressInput saat initialLocation berubah (misal saat edit)
  useEffect(() => {
    if (initialLocation && initialLocation.lat && initialLocation.lng) {
      setMarkerPosition(initialLocation);
      // Untuk menampilkan alamat saat edit, kita perlu melakukan reverse geocoding
      reverseGeocode(initialLocation.lat, initialLocation.lng);
    } else {
      // Reset ke default jika tidak ada initial location (misal saat membuat event baru)
      setMarkerPosition({ lat: -6.2088, lng: 106.8456 });
      setAddressInput("");
    }
  }, [initialLocation]);

  // Function to perform reverse geocoding (coordinates to address)
  const reverseGeocode = useCallback(async (lat, lng) => {
    setLoadingGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddressInput(data.display_name);
        // Panggil onSelectLocation setelah mendapatkan alamat
        onSelectLocation({ lat, lng, address: data.display_name });
      } else {
        setAddressInput("Alamat tidak ditemukan");
        onSelectLocation({ lat, lng, address: "" }); // Kirim koordinat saja jika alamat tidak ditemukan
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      setAddressInput("Gagal mendapatkan alamat");
      onSelectLocation({ lat, lng, address: "" });
    } finally {
      setLoadingGeocoding(false);
    }
  }, [onSelectLocation]);

  // Component to handle map clicks
  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lng });
        reverseGeocode(lat, lng); // Perform reverse geocoding on click
      },
    });
    return null;
  };

  // Function to perform forward geocoding (address to coordinates)
  const forwardGeocode = useCallback(async () => {
    if (!addressInput) return;
    setLoadingGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(addressInput)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        setMarkerPosition({ lat: newLat, lng: newLng });
        setAddressInput(display_name);
        onSelectLocation({ lat: newLat, lng: newLng, address: display_name });

        // Center the map on the new position
        const map = mapRef.current;
        if (map) {
          map.setView([newLat, newLng], 15); // Zoom to 15 after search
        }
      } else {
        console.warn("Alamat tidak ditemukan oleh Nominatim.");
        // Anda bisa memberikan feedback ke user di sini
        onSelectLocation({ lat: null, lng: null, address: addressInput }); // Kirim alamat yang diketik tapi tanpa koordinat
      }
    } catch (error) {
      console.error("Error during forward geocoding:", error);
      onSelectLocation({ lat: null, lng: null, address: addressInput });
    } finally {
      setLoadingGeocoding(false);
    }
  }, [addressInput, onSelectLocation]);

  const mapRef = useRef(null); // Ref for MapContainer instance

  return (
    <div style={{ height: "400px", width: "100%", position: "relative" }}>
      <div className="flex mb-2 space-x-2">
        <input
          type="text"
          placeholder="Cari lokasi atau klik di peta"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              forwardGeocode();
            }
          }}
          className="flex-1 p-2 border rounded-md shadow-sm focus:ring-[#00ADB5] focus:border-[#00ADB5]"
          disabled={loadingGeocoding}
        />
        <button
          type="button"
          onClick={forwardGeocode}
          className="px-4 py-2 bg-[#00ADB5] text-white rounded-md hover:bg-blue-600 transition duration-300"
          disabled={loadingGeocoding}
        >
          {loadingGeocoding ? "Mencari..." : "Cari"}
        </button>
      </div>

      <MapContainer
        center={markerPosition}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "calc(100% - 60px)", width: "100%", borderRadius: "8px" }}
        ref={mapRef} // Assign ref to MapContainer
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents /> {/* Custom component for map events */}
        {markerPosition.lat && markerPosition.lng && (
          <Marker position={markerPosition} />
        )}
      </MapContainer>
      {loadingGeocoding && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-20">
          <p className="text-gray-700">Memproses lokasi...</p>
        </div>
      )}
    </div>
  );
};

export default MapLocationPicker;