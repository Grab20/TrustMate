export type Role = 'driver' | 'owner' | 'both'

export interface Profile {
  id: string
  full_name: string
  phone?: string
  email?: string
  role: Role
  avatar_url?: string
  location?: string
  created_at: string
}

export interface DriverProfile {
  id: string
  user_id: string
  years_driving: number
  safe_parking: boolean
  platforms: string[]
  license_verified: boolean
  id_verified: boolean
  trust_score: number
  rentals_completed: number
  late_payments: number
  accidents: number
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Car {
  id: string
  owner_id: string
  make: string
  model: string
  year: number
  location: string
  deposit?: string
  insurance: boolean
  platforms: string[]
  price_per_week: number
  image_url?: string
  description?: string
  status: 'available' | 'rented' | 'inactive'
  created_at: string
  profiles?: Profile
}

export interface Application {
  id: string
  car_id: string
  driver_id: string
  status: 'pending' | 'approved' | 'rejected'
  message?: string
  created_at: string
  cars?: Car
  profiles?: Profile
  driver_profiles?: DriverProfile
}

export interface Review {
  id: string
  reviewer_id: string
  driver_id: string
  rating: number
  comment?: string
  created_at: string
  profiles?: Profile
}
