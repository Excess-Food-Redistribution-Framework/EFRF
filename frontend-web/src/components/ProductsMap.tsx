import React, { useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import LoadMapContainer from '../components/LoadMapContainer';
import { GetListOfProducts } from '../hooks/useProduct';
import { ProductMapProps } from '../types/productTypes';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  position: 'relative',
};

const mapContainerStyle: React.CSSProperties = {
  flex: 1,
  height: '50%',
  marginBottom: '20px',
  marginTop: '50px',
};

const buttonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  left: '60px',
  padding: '10px',
  background: 'orange',
  borderRadius: '8px',
  marginTop: '50px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
};

import ProductListModal from '../components/ProductListModal';

function ProductsMap({ params }: ProductMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDisabled] = useState<boolean>(true);
  const [page] = useState<number>(1);
  const [pageSize] = useState<number>(4);
  const { response, errorMessage } = GetListOfProducts(params);

  const showInfoWindow = (organization: any, marker: google.maps.Marker) => {
    if (infoWindow) {
      infoWindow.close();
    }
    const contentString = `<div><h3>${organization.name}</h3><p>${organization.address.street} ${organization.address.number}, ${organization.address.city}</p></div>`;

    const newInfoWindow = new window.google.maps.InfoWindow({
      content: contentString,
    });
    newInfoWindow.open(map!, marker);
    setInfoWindow(newInfoWindow);
    setSelectedOrganization(organization);
  };

  const handleMarkerClick = (organization: any, marker: google.maps.Marker) => {
    showInfoWindow(organization, marker);
  };

  const closeInfoWindow = () => {
    if (infoWindow) {
      infoWindow.close();
      setSelectedOrganization(null);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

    useEffect(() => {
      if (window.google && window.google.maps) {
    const fetchLocations = async () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });

      if (map && response && response.data && response.data.length > 0) {
        console.log(response.data);
        const bounds = new window.google.maps.LatLngBounds();
        const markers: Map<string, google.maps.Marker> = new Map();

        for (const product of response.data) {
          const organization = product.organization;

          if (organization && organization.type === 'Provider') {
            const { location } = organization;

            if (location && location.latitude && location.longitude) {
              try {
                const latLng = {
                  lat: location.latitude,
                  lng: location.longitude,
                };

                const marker = new window.google.maps.Marker({ position: latLng, map });
                if (!markers.has(organization.id)) markers.set(organization.id, marker);

                bounds.extend(latLng);

                marker.addListener('click', () => handleMarkerClick(organization, marker));
              } catch (error) {
                console.error(error);
              }
            }
          }
        }

        map.addListener('click', closeInfoWindow);

        const center = bounds.getCenter();
        const zoom = 13;

        map.setCenter(center);
        map.setZoom(zoom);
      }
    };

    const fetchData = async () => {
      if (map && response && response.data && response.data.length > 0) {
        await fetchLocations();
      }
    };
        fetchData();
      }
    }, [map, response, infoWindow, setInfoWindow, setSelectedOrganization]);
    

  return (
    <div style={containerStyle}>
      <LoadMapContainer googleMapsApiKey="AIzaSyDs5b037pFZXoneZJqkYotM5XQvcKTWcNE">
        <GoogleMap
          options={{
            disableDefaultUI: true,
            streetViewControl: true,
            streetViewControlOptions: {
              position: google.maps.ControlPosition.TOP_LEFT,
            },
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
        <div>
          <div style={buttonStyle} onClick={openModal}>
            Show products "{selectedOrganization.name}"
          </div>
        </div>
      )}
      <ProductListModal
        showModal={showModal}
        closeModal={closeModal}
        organization={selectedOrganization}
        page={page}
        pageSize={pageSize}
        showDisabled={showDisabled}
      />
    </div>
  );
}

export default ProductsMap;
