export interface SignupInfo {
  id?: number;
  sort?: null;
  created_on?: string;
  first_name: string;
  last_name: string;
  skill_level: string;
  comments: string;
  reserved: number;
}

export interface ReservedSeats {
  data: SignupInfo[];
}

export interface Guest {
  id: number;
  created_on: string;
  first_name: string;
  last_name: string;
  reserved: boolean;
}

export interface GuestList {
  data: Guest[];
}
