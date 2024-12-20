import IHelperService from "./IHelperService";

class HelperService implements IHelperService {
  calculateMovingAverage(prices: number[]): number {
    return prices.reduce((a, b) => a + b, 0) / prices.length;
  }
}

export default new HelperService();
