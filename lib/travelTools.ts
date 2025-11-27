
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
      departureTime: "2025-12-01T05:00:00",
      arrivalTime: "2025-12-01T15:30:00",
      duration: "PT10H30M",
      url: "https://www.example.com/flights"
    }
  ];
}

function makeDummyHotels(destination: string): HotelOption[] {
  if (!destination) return [];
  return [
    {
      provider: "DummyStay",
      name: `Central ${destination} Hotel`,
      pricePerNight: 120,
      currency: "USD",
      rating: 4.3,
      locationSummary: `Walkable to main sights in ${destination}.`,
      url: "https://www.example.com/hotels"
    },
    {
      provider: "BudgetInn",
      name: `${destination} Budget Inn`,
      pricePerNight: 80,
      currency: "USD",
      rating: 3.9,
      locationSummary: `Good value, basic comfort in ${destination}.`,
      url: "https://www.example.com/hotels"
    }
  ];
}

function makeDummyLocalTransport(destination: string): LocalTransportOption[] {
  return [
    {
      type: "Airport → City taxi",
      provider: "Typical local taxi",
      approxPrice: 40,
      currency: "USD",
      description: `Approximate taxi or rideshare cost from airport to central ${destination}.`
    },
    {
      type: "Public transport day pass",
      provider: "Local metro/bus",
      approxPrice: 10,
      currency: "USD",
      description: `Estimated cost for a day pass on public transport in ${destination}.`
    }
  ];
}

export async function travelSearchTool(input: TravelSearchInput): Promise<TravelSearchResult> {
  const {
    origin = "",
    destination,
    startDate = "",
    endDate = "",
    adults = 1,
    budgetPerPerson
  } = input;

  // Everything here is offline/dummy logic – no real API calls.
  const flights = makeDummyFlights(origin, destination);
  const hotels = makeDummyHotels(destination);
  const localTransport = makeDummyLocalTransport(destination);

  const notes = [
    "Dummy travel search result. No live API is configured.",
    "All prices are rough estimates only and must be verified on real booking sites.",
    `Origin: ${origin || "unknown"}, Destination: ${destination || "unknown"}, Dates: ${startDate} to ${endDate}, Adults: ${adults}, Budget per person: ${budgetPerPerson ?? "unspecified"}.`
  ].join(" ");

  return {
    flights,
    hotels,
    localTransport,
    notes
  };
}
