const FREE_SHIPPING_THRESHOLD = 599;

const SHIPPING_RATES = {
  NEARBY: 49,
  ODISHA_AND_NEARBY: 59,
  EAST_NORTH_CENTRAL: 79,
  SOUTH_WEST_FAR: 99,
} as const;

/**
 * JK Graphix pickup location
 */
const ORIGIN_PIN_PREFIX = "756";

/**
 * Returns the manual shipping charge based on destination PIN.
 *
 * Rules:
 * ₹599+ subtotal → FREE
 *
 * Below ₹599:
 * 756xxx → ₹49
 * Odisha + nearby states → ₹59
 * East/North/Central India → ₹79
 * South/West/far locations → ₹99
 */
export function calculateShippingCost(
  subtotal: number,
  pinCode: string
): number {
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    throw new Error("Invalid subtotal.");
  }

  const pin = pinCode.trim();

  if (!/^\d{6}$/.test(pin)) {
    throw new Error("Invalid PIN Code.");
  }

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  /*
   * Nearby pickup region.
   * JK Graphix pickup PIN: 756101
   */
  if (pin.startsWith(ORIGIN_PIN_PREFIX)) {
    return SHIPPING_RATES.NEARBY;
  }

  /*
   * Odisha PIN ranges generally begin with 75, 76 or 77.
   *
   * Nearby eastern states:
   * Jharkhand: 81–83
   * West Bengal: 70–74
   * Chhattisgarh: 49
   */
  const firstTwo = Number(pin.slice(0, 2));

  if (
    (firstTwo >= 75 && firstTwo <= 77) ||
    (firstTwo >= 81 && firstTwo <= 83) ||
    (firstTwo >= 70 && firstTwo <= 74) ||
    firstTwo === 49
  ) {
    return SHIPPING_RATES.ODISHA_AND_NEARBY;
  }

  /*
   * East / North / Central India
   */
  if (
    (firstTwo >= 80 && firstTwo <= 85) ||
    (firstTwo >= 10 && firstTwo <= 19) ||
    (firstTwo >= 20 && firstTwo <= 29) ||
    (firstTwo >= 30 && firstTwo <= 39) ||
    (firstTwo >= 40 && firstTwo <= 48)
  ) {
    return SHIPPING_RATES.EAST_NORTH_CENTRAL;
  }

  /*
   * South / West / remaining destinations
   */
  return SHIPPING_RATES.SOUTH_WEST_FAR;
}

export { FREE_SHIPPING_THRESHOLD };
