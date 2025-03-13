export const calculateShippingCost = (packages: any[]): number => {
  const baseCostPerPackage = 5;

  const weightCostRate = 2.5;
  const volumeCostRate = 0.05;

  let totalCost = 0;

  for (const pkg of packages) {
    const volume = pkg.length * pkg.width * pkg.height;

    const costPerPackage =
      baseCostPerPackage +
      pkg.weight * weightCostRate +
      volume * volumeCostRate;

    totalCost += costPerPackage * pkg.quantity;
  }

  return totalCost;
};
