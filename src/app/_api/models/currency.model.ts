export interface CurrencyModel {
  base: string;
  ms: number;
  results: CurrencyResult;
  updated: Date;
  amount?: number,
  result?: CurrencyFormResult,
}

export enum CurrencyType {
  EUR = "EUR",
  USD = "USD",
  UAH = "UAH"
}

export interface CurrencyFormResult {
  EUR: number,
  rate: number
}

export type CurrencyResult = {
  [key in CurrencyType]: number;
};
