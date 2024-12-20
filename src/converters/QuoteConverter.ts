import finnhub from "finnhub-ts";
import { Quote } from "../entities";

function convertToDTO(quote: finnhub.Quote, symbol: string): Partial<Quote> {
  return { price: quote.c ?? 0, symbol };
}

export { convertToDTO };
