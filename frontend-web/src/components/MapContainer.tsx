import React, { useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import LoadMapContainer from '../components/LoadMapContainer';
import { MapContainerProps } from '../types/mapTypes';


const mapContainerStyle = {
  width: '100%',
  height: '800px',
};

function MapContainer({ location }: MapContainerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (!location) {
          console.error('Organization or location is missing.');
          return;
        }
        const latLng = {
          lat: location.latitude,
          lng: location.longitude,
        };
        
        const fixedZoom = 14;
    
        if (map) {
          map.setCenter(latLng);
          map.setZoom(fixedZoom);
          new window.google.maps.Marker({
            map,
            position: latLng,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (map && location) {
      fetchLocation();
    }
  }, [map, location]);

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