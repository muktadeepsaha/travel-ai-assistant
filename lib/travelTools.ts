
// lib/travelTools.ts

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

async function callExternalSearchAPI(query: string): Promise<any> {
  const apiKey = process.env.TRAVEL_SEARCH_API_KEY;
  const base = process.env.TRAVEL_SEARCH_API_BASE;

  if (!apiKey || !base) {
    // Fallback: pretend empty; model will then reason without live prices.
    return { results: [] };
  }

  const res = await fetch(base.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({ query, source: "voyagegenie" })
  });

  if (!res.ok) {
    throw new Error(`Travel search API error: ${res.status}`);
  }

  return res.json();
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

  const query = `
Check flights and hotels for:
- Origin: ${origin}
- Destination: ${destination}
- Dates: ${startDate} to ${endDate}
- Travelers: ${adults}
- Budget per person: ${budgetPerPerson ?? "unspecified"}

Return structured JSON with flights, hotels, and local transport if possible.
`;

  try {
    const raw = await callExternalSearchAPI(query);

    const result: TravelSearchResult = {
      flights: raw.flights ?? [],
      hotels: raw.hotels ?? [],
      localTransport: raw.localTransport ?? [],
      notes: raw.notes ?? "Results returned from external travel search API."
    };

    return result;
  } catch (err) {
    console.error("travelSearchTool error:", err);
    return {
      flights: [],
      hotels: [],
      localTransport: [],
      notes:
        "Travel search API failed. Use approximate ranges, typical options, and explain that prices are estimates only."
    };
  }
}
