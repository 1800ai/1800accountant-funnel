// Approximate LLC formation filing fees by state ($USD)
export const STATE_FILING_FEES = {
  AL: 200, AK: 250, AZ: 50,  AR: 45,  CA: 70,  CO: 50,  CT: 120, DE: 90,
  DC: 99,  FL: 125, GA: 100, HI: 50,  ID: 100, IL: 150, IN: 95,  IA: 50,
  KS: 160, KY: 40,  LA: 100, ME: 175, MD: 100, MA: 500, MI: 50,  MN: 155,
  MS: 50,  MO: 50,  MT: 35,  NE: 100, NV: 75,  NH: 100, NJ: 125, NM: 50,
  NY: 200, NC: 125, ND: 135, OH: 99,  OK: 100, OR: 100, PA: 125, RI: 150,
  SC: 110, SD: 150, TN: 300, TX: 300, UT: 70,  VT: 125, VA: 100, WA: 200,
  WV: 100, WI: 130, WY: 100,
}

export function getStateFilingFee(stateAbbr) {
  return STATE_FILING_FEES[stateAbbr] ?? 100
}
