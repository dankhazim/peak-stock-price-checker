import { Quote } from "../entities";

export interface IStockRepository {
  save(quote: Partial<Quote>): Promise<Partial<Quote>>;

  findBySymbol(symbol: string): Promise<Quote | null>;

  findLastXBySymbol(symbol: string, x: number): Promise<Quote[]>;
}
