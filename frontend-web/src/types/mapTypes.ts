import { OrganizationLocation, OrganizationAddress } from './organizationTypes';

export interface ProductsMapProps {
    organizations: {
      id: string;
      type: 'Provider' | 'Distributor';
      name: string;
      address: OrganizationAddress,
      location: OrganizationLocation
    }[];
}

export interface MapContainerProps {
  location: {
    longitude: number;
    latitude: number;
  }
}
