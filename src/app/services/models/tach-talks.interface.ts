export interface SignUpState {
  guestList: Guest[];
  alerts: Alerts[];
  closed: boolean;
  allowed: boolean;
  success: boolean;
  reserved: boolean;
}

export interface UserInfo {
  id?: number;
  sort?: null;
  created_on?: string;
  first_name: string;
  last_name: string;
  skill_level: string;
  comments: string;
  reserved: number;
}

export interface SignUpList {
  data: UserInfo[];
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

export interface UserAlerts {
  data: Alerts[];
}

export interface Alerts {
  id: number;
  user_alerts: AlertMsgs;
}

export interface AlertMsgs {
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
