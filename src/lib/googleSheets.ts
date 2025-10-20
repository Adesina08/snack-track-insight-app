import { format } from "date-fns";

export interface SheetRecord {
  [key: string]: string | undefined;
}

export interface ConsumptionRecord {
  product?: string;
  category?: string;
  brand?: string;
  points?: number;
  date?: string;
  raw: SheetRecord;
}

export interface ConsumptionAnalytics {
  timeSeries: ChartData[];
  categories: ChartData[];
  brands: ChartData[];
}

export interface ChartData {
  name: string;
  value: number;
  secondary?: number;
}

const sheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID || "";
const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || "";
const range = import.meta.env.VITE_GOOGLE_SHEETS_RANGE || "Sheet1!A1:Z";

const normaliseKey = (key: string) => {
  const segments = key
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment.toLowerCase());

  if (!segments.length) {
    return "";
  }

  return segments
    .map((segment, index) =>
      index === 0 ? segment : segment.charAt(0).toUpperCase() + segment.slice(1)
    )
    .join("");
};

const preferredKeys = {
  product: ["product", "item", "food", "meal", "snack"],
  category: ["category", "foodCategory", "mealCategory"],
  brand: ["brand", "brandName", "company", "vendor"],
  points: ["points", "score", "rewardPoints", "weight"],
  date: ["date", "timestamp", "createdAt", "submissionDate"],
};

type PreferredKey = keyof typeof preferredKeys;

const findValue = (record: SheetRecord, key: PreferredKey) => {
  const targets = preferredKeys[key];
  for (const target of targets) {
    const normalised = normaliseKey(target);
    if (record[normalised]) {
      return record[normalised];
    }
  }
  return undefined;
};

const parseNumber = (value?: string) => {
  if (!value) return undefined;
  const parsed = Number(value.replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseDate = (value?: string) => {
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return undefined;
  return new Date(timestamp);
};

export const googleSheetsService = {
  async fetchConsumptionRecords(): Promise<ConsumptionRecord[]> {
    if (!sheetId || !apiKey) {
      throw new Error(
        "Google Sheets configuration missing. Please set VITE_GOOGLE_SHEETS_ID and VITE_GOOGLE_SHEETS_API_KEY."
      );
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Google Sheets request failed: ${response.status} ${message}`);
    }

    const json = await response.json();
    const values: string[][] = json.values || [];
    if (values.length <= 1) {
      return [];
    }

    const headers = values[0].map(normaliseKey);
    const records: ConsumptionRecord[] = values.slice(1).map((row) => {
      const record: SheetRecord = {};
      headers.forEach((header, index) => {
        if (!header) return;
        record[header] = row[index];
      });

      const consumption: ConsumptionRecord = {
        product: findValue(record, "product"),
        category: findValue(record, "category"),
        brand: findValue(record, "brand"),
        points: parseNumber(findValue(record, "points")),
        date: findValue(record, "date"),
        raw: record,
      };

      return consumption;
    });

    return records;
  },
};

const buildFrequency = (values: (string | undefined)[]) => {
  const map = new Map<string, number>();
  for (const value of values) {
    const key = value?.trim() || "Unknown";
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
};

export const buildConsumptionAnalytics = (
  records: ConsumptionRecord[]
): ConsumptionAnalytics => {
  if (!records.length) {
    return {
      timeSeries: [],
      categories: [],
      brands: [],
    };
  }

  const dateMap = new Map<string, { label: string; count: number }>();
  const categories = buildFrequency(records.map((record) => record.category));
  const brands = buildFrequency(records.map((record) => record.brand));

  for (const record of records) {
    const parsed = parseDate(record.date);
    if (!parsed) continue;
    const key = format(parsed, "yyyy-MM-dd");
    const label = format(parsed, "MMM d");
    const entry = dateMap.get(key) || { label, count: 0 };
    entry.count += 1;
    dateMap.set(key, entry);
  }

  const timeSeries = Array.from(dateMap.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([_, value]) => ({ name: value.label, value: value.count }));

  const totalBrands = Array.from(brands.values()).reduce((acc, count) => acc + count, 0) || 1;
  const brandData = Array.from(brands.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, value: Number(((count / totalBrands) * 100).toFixed(2)), secondary: count }));

  const categoryData = Array.from(categories.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, value: count }));

  return {
    timeSeries,
    categories: categoryData,
    brands: brandData,
  };
};

