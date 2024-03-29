// Získanie organizácie prihlaseného používateľa
// GET /api/Oragnization/Current

// Definícia pre odpoveď volania API pre získanie organizácie
export interface OrganizationApiResponse {
  id: string;
  name: string;
  type: 'Provider' | 'Distributor';
  information: string;
  location: OrganizationLocation;
  address: OrganizationAddress;
}

// Definícia pre geografickú polohu organizácie
export interface OrganizationLocation {
  longitude: number;
  latitude: number;
}

// Definícia pre adresu organizácie
export interface OrganizationAddress {
  state: string;
  city: string;
  street: string;
  number: string;
  zipCode: string;
}
