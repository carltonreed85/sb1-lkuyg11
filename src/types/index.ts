// Add to existing types
export interface Specialty {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  active: boolean;
  specialties: string[]; // Array of specialty IDs
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  active: boolean;
  specialties: string[]; // Array of specialty IDs
  locations: string[]; // Array of location IDs where provider practices
}