
// lib/travelTools.ts – dummy/no-external-API version

export type TravelSearchInput = {
  origin?: string;
  destination: string;
  startDate?: string;   // YYYY-MM-DD
  endDate?: string;     // YYYY-MM-DD
  adults?: number;
  budgetPerPerson?: number;
};

export type FlightOption = {
  provider: string;
  price: number;
  currency: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  url?: string;
};

export type HotelOption = {
  provider: string;
  name: string;
  pricePerNight: number;
  currency: string;
  rating?: number;
  locationSummary?: string;
  url?: string;
};

export type LocalTransportOption = {
  type: string;         // e.g., "metro pass", "taxi", "rideshare"
  provider?: string;
  approxPrice: number;
  currency: string;
  description: string;
  url?: string;
};

export type TravelSearchResult = {
  flights?: FlightOption[];
  hotels?: HotelOption[];
  localTransport?: LocalTransportOption[];
  notes?: string;
};

function makeDummyFlights(origin: string, destination: string): FlightOption[] {
  if (!origin || !destination) return [];

  // Very rough dummy prices/durations just to give the model something structured
  return [
    {
      provider: "DummyAir",
      price: 550,
      currency: "USD",
      from: origin,
      to: destination,
      departureTime: "2025-12-01T02:00:00",
      arrivalTime: "2025-12-01T12:30:00",
      duration: "PT10H30M",
      url: "https://www.example.com/flights"
    },
    {
      provider: "BudgetWings",
      price: 480,
      currency: "USD",
      from: origin,
      to: destination,
      departureTime: "2025-12-0
