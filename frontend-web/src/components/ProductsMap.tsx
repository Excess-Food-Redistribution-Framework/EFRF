import React, { useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import LoadMapContainer from '../components/LoadMapContainer';
import { ProductsMapProps } from '../types/mapTypes';
import { geocodeAddress } from '../utils/geocodeUtils';
import ProductCards from '../components/ProductCards';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
};

const mapContainerStyle: React.CSSProperties = {
  flex: 1,
  height: '100vh',
};

const cardsContainerStyle: React.CSSProperties = {
  flex: 1,
  padding: '20px',
};

function ProductsMap({ organizations }: ProductsMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const [showDisabled] = useState<boolean>(true);
  const [page] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [isPagination] = useState<boolean>(true);

  useEffect(() => {
    const fetchLocations = async () => {
     /* window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });*/
      if (map && organizations.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        const markers: google.maps.Marker[] = [];

        for (const organization of organizations) {
          if (organization.type === 'Provider') {
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

                  const marker = new window.google.maps.Marker({ position: latLng, map });
                  markers.push(marker);

                  bounds.extend(latLng);

                  marker.addListener('click', () => {
                    showInfoWindow(organization, marker);
                  });
                }
              } catch (error) {
                console.error(error);
              }
            }
          }
        }

        map.addListener('click', () => {
          if (infoWindow) {
            infoWindow.close();
            setSelectedOrganization(null);
          }
        });

        map.fitBounds(bounds);
      }
    };

    const showInfoWindow = (organization: any, marker: google.maps.Marker) => {
      if (infoWindow) {
        infoWindow.close();
      }

      const contentString = `<div><h3>${organization.name}</h3><p>${organization.address.street} ${organization.address.number}, ${organization.address.city}, ${organization.address.state}</p></div>`;

      const newInfoWindow = new window.google.maps.InfoWindow({
        content: contentString,
      });

      newInfoWindow.open(map!, marker);
      setInfoWindow(newInfoWindow);
      setSelectedOrganization(organization);
    };

    if (map && organizations.length > 0) {
      fetchLocations();
    }
  }, [map, organizations, infoWindow]);

  return (
    <div style={containerStyle}>
      <LoadMapContainer googleMapsApiKey="AIzaSyDs5b037pFZXoneZJqkYotM5XQvcKTWcNE">
        <GoogleMap 
          options={{
            disableDefaultUI: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
          mapContainerStyle={mapContainerStyle}
          onLoad={(map) => setMap(map)}
        />
      </LoadMapContainer>
      
      {selectedOrganization && (
        <div style={cardsContainerStyle}>
          <ProductCards
            params={{
              page,
              pageSize,
              onlyAvailable: !showDisabled,
              notExpired: !showDisabled,
              organizationId: selectedOrganization.id,
            }}
            pagination={isPagination}
          />
        </div>
      )}
    </div>
  );
}

export default ProductsMap;
