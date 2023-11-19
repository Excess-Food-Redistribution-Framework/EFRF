import React, { useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import LoadMapContainer from '../components/LoadMapContainer';
import { MapContainerProps } from '../types/mapTypes';
import { geocodeAddress } from '../utils/geocodeUtils';

const mapContainerStyle = {
  width: '100%',
  height: '800px',
};

function MapContainer({ address }: MapContainerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const fullAddress = `${address.street} ${address.number}, ${address.city}, ${address.state}, ${address.zipCode}`;
        const result = await geocodeAddress(fullAddress);

        if (map && result?.geometry?.location) {
          const latLng = result.geometry.location;

          const bounds = result.geometry.viewport;
          console.log('Bounds:', bounds.toString());
          
          map.fitBounds(bounds);

          new window.google.maps.Marker({
            map,
            position: latLng,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (map && address) {
      fetchLocation();
    }
  }, [map, address]);

  return (
    <LoadMapContainer googleMapsApiKey="AIzaSyDs5b037pFZXoneZJqkYotM5XQvcKTWcNE">
      <GoogleMap 
        mapContainerStyle={mapContainerStyle}
        onLoad={(map) => setMap(map)}
      >
      </GoogleMap>
    </LoadMapContainer>
  );
}

export default MapContainer;
