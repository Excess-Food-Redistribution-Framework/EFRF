export interface OrganizationApiResponse {
  id: string;
  name: string;
  type: 'Provider' | 'Distributor';
  information: string;
  address: OrganizationAddress
  location: OrganizationLocation
}

export interface OrganizationAddress{
  state: string;
  city: string;
  street: string;
  number: string;
  zipCode: string
}

export interface OrganizationLocation{
  longitude: number;
  latitude: number;
}