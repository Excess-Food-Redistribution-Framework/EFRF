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
      };
    }[];
}

export interface MapContainerProps {
    address: {
      state: string;
      city: string;
      street: string;
      number: string;
      zipCode: string;
    };
}