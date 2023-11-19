// ProductsMap.tsx
import React, { useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import LoadMapContainer from '../components/LoadMapContainer';
import { ProductsMapProps } from '../types/mapTypes';
import { geocodeAddress } from '../utils/geocodeUtils';

const mapContainerStyle = {
  width: '100%',
  height: '71vh',
};

function ProductsMap({ organizations }: ProductsMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      if (map && organizations.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        const markers: google.maps.Marker[] = [];

        for (const organization of organizations) {
          const { address } = organization;

          if (address && address.street && address.number && address.city && address.state && address.zipCode) {
            const fullAddress = `${address.street} ${address.number}, ${address.city}, ${address.state}, ${address.zipCode}`;

            try {
              const result = await geocodeAddress(fullAddress);

              if (result?.geometry?.location) {
                const latLng = result.geometry.location;

                const circle = new window.google.maps.Circle({
                  map,
                  center: latLng,
                  radius: 90,
                  fillColor: 'blue',
                  fillOpacity: 0.5,
                  strokeColor: 'blue',
                  strokeOpacity: 1,
                  strokeWeight: 1,
                });

                markers.push(new window.google.maps.Marker({ position: latLng, map }));

                bounds.extend(latLng);
              }
            } catch (error) {
              console.error(error);
            }
          }
        }

        map.addListener('click', () => {
          if (infoWindow) {
            infoWindow.close();
          }
        });

        markers.forEach((marker, index) => {
          marker.addListener('click', () => {
            showInfoWindow(organizations[index], marker);
          });
        });

        console.log('Bounds:', bounds.toString());
        map.fitBounds(bounds);
      }
    };

    const showInfoWindow = (organization: any, marker: google.maps.Marker) => {
      if (infoWindow) {
        infoWindow.close();
      }

      const contentString = `<div><h3>${organization.name}</h3><p>${organization.address.city}, ${organization.address.state}</p></div>`;

      const newInfoWindow = new window.google.maps.InfoWindow({
        content: contentString,
      });

      newInfoWindow.open(map!, marker);
      setInfoWindow(newInfoWindow);
    };

    if (map && organizations.length > 0) {
      fetchLocations();
    }
  }, [map, organizations, infoWindow]);

  return (
    <LoadMapContainer googleMapsApiKey="AIzaSyDs5b037pFZXoneZJqkYotM5XQvcKTWcNE">
      <GoogleMap 
        mapContainerStyle={mapContainerStyle}
        onLoad={(map) => setMap(map)}
      />
    </LoadMapContainer>
  );
}

export default ProductsMap;
