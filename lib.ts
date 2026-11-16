export const SERVICES = [
  { id: "interior", name: "Interior detail", blurb: "Vacuum, wipe-down, windows, vents", base: 90 },
  { id: "exterior", name: "Exterior detail", blurb: "Hand wash, clay bar, wax, wheels", base: 100 },
  { id: "full", name: "Full detail", blurb: "Interior and exterior, start to finish", base: 170 },
] as const;

export const SIZES = [
  { id: "sedan", name: "Car / coupe", extra: 0 },
  { id: "suv", name: "SUV / crossover", extra: 30 },
  { id: "truck", name: "Truck / van / 3-row", extra: 60 },
] as const;

export const ADDONS = [
  { id: "pet", name: "Pet hair removal", price: 35 },
  { id: "shampoo", name: "Carpet and seat shampoo", price: 50 },
  { id: "headlight", name: "Headlight restoration", price: 40 },
] as const;

export function priceFor(service: string, size: string, addons: string[]) {
  const s = SERVICES.find((x) => x.id === service);
  const z = SIZES.find((x) => x.id === size);
  if (!s || !z) return null;
  const add = ADDONS.filter((a) => addons.includes(a.id));
  return { total: s.base + z.extra + add.reduce((n, a) => n + a.price, 0), s, z, add };
}
