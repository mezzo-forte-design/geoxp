import type GeoXpWeb from "@geoxp/web";

declare global {
  interface Window {
    geoXp: GeoXpWeb;
  }
}

// At least one export statement
export {};
