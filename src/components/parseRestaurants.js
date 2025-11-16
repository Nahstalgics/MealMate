import rawData from './data/business-licences.json';

const restaurants = Array.isArray(rawData) ? rawData : [rawData];

export function parseRestaurants() {
  return restaurants
    .filter((r) => 
      r.businesstradename &&
      r.status === "Issued" &&
      r.house &&
      r.street &&
      r.postalcode &&
      r.geo_point_2d
    )
    .map((r) => ({
      businesstradename: r.businesstradename,
      house: r.house,
      street: r.street,
      postalcode: r.postalcode,
      geo_point_2d: r.geo_point_2d
    }));
}