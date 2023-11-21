export interface ProductsMapProps {
    organizations: {
      id: string;
      type: 'Provider' | 'Distributor';
      name: string;
      address: {
        state: string;
        city: string;
        street: string;
        number: string;
        zipCode: string;
      },
      location: { 
        longitude: number;
        latitude: number;
      }
    }[];
}

export interface MapContainerProps {
    location: {
      longitude: number;
      latitude: number;
    }
}