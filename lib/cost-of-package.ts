export function calculateShippingCost(
  weight: number,
  dimensions: string,
): number {
  // Implement your actual cost calculation logic
  const [length, width, height] = dimensions.split("x").map(Number);
  const volume = length * width * height;
  return weight * 2 + volume * 0.1;
}
