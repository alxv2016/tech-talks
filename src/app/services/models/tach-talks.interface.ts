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

export interface Signups {
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

export interface Alerts {
  data: UserAlerts[];
}

export interface UserAlerts {
  id: number;
  user_alerts: UserAlert;
}

export interface UserAlert {
  guest_list: string;
  signup_success: string;
  generic_error: string;
  first_name_error: string;
  last_name_error: string;
  invalid_name: string;
  skill_level_error: string;
  reserved_error: string;
  no_seats_left: string;
}
