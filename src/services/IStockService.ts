import { Quote } from "../entities";
import QuoteResponse from "../types/QuoteResponse";

interface IStockService {
  storeStockPrice(symbol: string): Promise<Partial<Quote>>;

  getStockPrice(symbol: string): Promise<QuoteResponse>;

  scheduleSymbolMonitoring(symbol: string): void;
}

export default IStockService;
