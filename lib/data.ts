export type CurrencyCode = "EUR" | "GBP" | "USD";

export interface Wallet {
  currency: CurrencyCode;
  symbol: string;
  name: string;
  balance: number;
  account: string;
  // identifiers vary by region
  iban?: string;
  bic?: string;
  sortCode?: string;
  accountNo?: string;
  routing?: string;
  bank: string;
  holder: string;
}

export interface Transaction {
  id: number;
  merchant: string;
  type: "debit" | "credit";
  amount: number;
  currency: CurrencyCode;
  date: string;
  category: TxCategory;
  status: "success" | "pending";
  method: string;
  reference: string;
  rate?: string;
}

export type TxCategory =
  | "Entertainment"
  | "Income"
  | "Shopping"
  | "Travel"
  | "Transport"
  | "Transfer"
  | "Exchange"
  | "Fees"
  | "Top-up"
  | "Food";

export const currencySymbol: Record<CurrencyCode, string> = {
  EUR: "€",
  GBP: "£",
  USD: "$",
};

/** The wallet's default / display currency. */
export const defaultCurrency: CurrencyCode = "EUR";

/**
 * Live mid-market rates expressed as "1 unit of X = N EUR".
 * EUR is the base, so all balances roll up into EUR by default.
 */
export const marketRates: Record<CurrencyCode, number> = {
  EUR: 1,
  GBP: 1.17,
  USD: 0.92,
};

/** Convert an amount between currencies at the mid-market rate. */
export function convert(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  return (amount * marketRates[from]) / marketRates[to];
}

/** A human-readable "1 FROM = x.xx TO" rate line. */
export function rateLine(from: CurrencyCode, to: CurrencyCode): string {
  const r = convert(1, from, to);
  return `1 ${from} = ${r.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })} ${to}`;
}

export const wallets: Wallet[] = [
  {
    currency: "EUR",
    symbol: "€",
    name: "Euro",
    balance: 121.61,
    account: "•••• 2554",
    iban: "LT93 3981 8000 0096 2554",
    bic: "DIUALT22XXX",
    bank: "Trip",
    holder: "IZABELA KULMA",
  },
  {
    currency: "GBP",
    symbol: "£",
    name: "British Pound",
    balance: 33.03,
    account: "•••• 7731",
    sortCode: "20-18-34",
    accountNo: "58739214",
    bank: "Barclays Bank UK",
    holder: "IZABELA KULMA",
  },
  {
    currency: "USD",
    symbol: "$",
    name: "US Dollar",
    balance: 90.0,
    account: "•••• 9902",
    routing: "026009593",
    accountNo: "000123456789",
    bank: "Bank of America",
    holder: "IZABELA KULMA",
  },
];

const card = { GBP: "Card •••• 7731", EUR: "Card •••• 2554", USD: "Card •••• 9902" };

export const transactions: Transaction[] = [
  // Today — Jul 6
  { id: 220, merchant: "Freelance — Apex Digital", type: "credit", amount: 4500.0, currency: "EUR", date: "Today", category: "Income", status: "success", method: "Bank transfer", reference: "APEX-INV-0706-001" },
  { id: 222, merchant: "Client Payment — Mercer & Co", type: "credit", amount: 7000.0, currency: "GBP", date: "Today", category: "Income", status: "success", method: "Bank transfer", reference: "MERCER-INV-0706-88" },
  { id: 224, merchant: "Deliveroo", type: "debit", amount: -13.4, currency: "EUR", date: "Today", category: "Food", status: "success", method: card.EUR, reference: "DLVR-0706-0091" },
  { id: 225, merchant: "TfL", type: "debit", amount: -6.8, currency: "GBP", date: "Today", category: "Transport", status: "success", method: card.GBP, reference: "TFL-0706-2201" },
  { id: 226, merchant: "Rent — Jul 2026", type: "debit", amount: -950.0, currency: "EUR", date: "Today", category: "Transfer", status: "success", method: "Bank transfer", reference: "RENT-0706-JUL26" },
  { id: 227, merchant: "Starbucks", type: "debit", amount: -5.6, currency: "GBP", date: "Today", category: "Food", status: "success", method: card.GBP, reference: "SBUX-0706-0041" },
  // Yesterday — Jul 5
  { id: 216, merchant: "Wire In — Goldstein Partners", type: "credit", amount: 2700.0, currency: "USD", date: "Yesterday", category: "Income", status: "success", method: "Bank transfer", reference: "GOLD-WIRE-IN-0705" },
  { id: 214, merchant: "Supplier Payment — VentureTech", type: "credit", amount: 680.0, currency: "EUR", date: "Yesterday", category: "Transfer", status: "success", method: "Bank transfer", reference: "VT-PAY-IN-0705-332" },
  { id: 218, merchant: "Starbucks", type: "debit", amount: -7.2, currency: "GBP", date: "Yesterday", category: "Food", status: "success", method: card.GBP, reference: "SBUX-0705-8812" },
  { id: 217, merchant: "To Anna Kowalski", type: "debit", amount: -120.0, currency: "USD", date: "Yesterday", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-AKOWALSKI-0705" },
  { id: 219, merchant: "Spotify", type: "debit", amount: -9.99, currency: "GBP", date: "Yesterday", category: "Entertainment", status: "success", method: card.GBP, reference: "SPOT-0705-4471" },
  { id: 215, merchant: "Bolt Food", type: "debit", amount: -14.3, currency: "EUR", date: "Yesterday", category: "Food", status: "success", method: card.EUR, reference: "BOLT-FOOD-0705-0071" },
  // Jul 4
  { id: 208, merchant: "Invoice — Stratford Studio", type: "credit", amount: 1800.0, currency: "GBP", date: "Jul 4", category: "Income", status: "success", method: "Bank transfer", reference: "STRAT-INV-0704-19" },
  { id: 209, merchant: "From Klara Nowak", type: "credit", amount: 45.0, currency: "EUR", date: "Jul 4", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-KNOWAK-0704" },
  { id: 210, merchant: "Amazon", type: "debit", amount: -19.99, currency: "GBP", date: "Jul 4", category: "Shopping", status: "success", method: card.GBP, reference: "AMZ-0704-5512" },
  { id: 211, merchant: "Bolt Food", type: "debit", amount: -11.8, currency: "EUR", date: "Jul 4", category: "Food", status: "success", method: card.EUR, reference: "BOLT-FOOD-0704-0041" },
  { id: 212, merchant: "Card maintenance fee", type: "debit", amount: -2.99, currency: "GBP", date: "Jul 4", category: "Fees", status: "success", method: "Service charge", reference: "FEE-CARD-0704" },
  // Jul 3
  { id: 204, merchant: "From Mia Larsson", type: "credit", amount: 55.0, currency: "EUR", date: "Jul 3", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-MLARSSON-0703" },
  { id: 207, merchant: "From Olivia Schmidt", type: "credit", amount: 200.0, currency: "EUR", date: "Jul 3", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-OSCHMIDT-0703" },
  { id: 205, merchant: "Bolt Food", type: "debit", amount: -11.8, currency: "EUR", date: "Jul 3", category: "Food", status: "success", method: card.EUR, reference: "BOLT-FOOD-0703-0041" },
  { id: 206, merchant: "Spotify", type: "debit", amount: -9.99, currency: "GBP", date: "Jul 3", category: "Entertainment", status: "success", method: card.GBP, reference: "SPOT-0703-2291" },
  { id: 228, merchant: "TfL", type: "debit", amount: -4.8, currency: "GBP", date: "Jul 3", category: "Transport", status: "success", method: card.GBP, reference: "TFL-0703-4412" },
  // Jul 2
  { id: 201, merchant: "From Felix Weber", type: "credit", amount: 80.0, currency: "EUR", date: "Jul 2", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-FWEBER-0702" },
  { id: 200, merchant: "Amazon", type: "debit", amount: -27.49, currency: "GBP", date: "Jul 2", category: "Shopping", status: "success", method: card.GBP, reference: "AMZ-0702-8812" },
  { id: 202, merchant: "TfL", type: "debit", amount: -9.4, currency: "GBP", date: "Jul 2", category: "Transport", status: "success", method: card.GBP, reference: "TFL-0702-5530" },
  { id: 203, merchant: "Card maintenance fee", type: "debit", amount: -2.99, currency: "GBP", date: "Jul 2", category: "Fees", status: "success", method: "Service charge", reference: "FEE-CARD-0702" },
  { id: 229, merchant: "Bolt Food", type: "debit", amount: -9.6, currency: "EUR", date: "Jul 2", category: "Food", status: "success", method: card.EUR, reference: "BOLT-FOOD-0702-0055" },
  // Jul 1
  { id: 192, merchant: "Salary — Northwind Ltd", type: "credit", amount: 2450.0, currency: "GBP", date: "Jul 1", category: "Income", status: "success", method: "Bank transfer", reference: "NW-PAYROLL-0701" },
  { id: 194, merchant: "From Klara Nowak", type: "credit", amount: 90.0, currency: "EUR", date: "Jul 1", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-KNOWAK-0701" },
  { id: 193, merchant: "Tesco", type: "debit", amount: -38.14, currency: "GBP", date: "Jul 1", category: "Food", status: "success", method: card.GBP, reference: "TESC-0701-3310" },
  { id: 195, merchant: "Monthly account fee", type: "debit", amount: -5.0, currency: "GBP", date: "Jul 1", category: "Fees", status: "success", method: "Service charge", reference: "FEE-MONTH-0701" },
  // Jun 30
  { id: 188, merchant: "From Daniel Cohen", type: "credit", amount: 150.0, currency: "USD", date: "Jun 30", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-DCOHEN-0630" },
  { id: 189, merchant: "Deliveroo", type: "debit", amount: -21.6, currency: "GBP", date: "Jun 30", category: "Food", status: "success", method: card.GBP, reference: "DLVR-0630-4471" },
  { id: 190, merchant: "Netflix", type: "debit", amount: -15.99, currency: "USD", date: "Jun 30", category: "Entertainment", status: "success", method: card.USD, reference: "NFLX-0630-7712" },
  { id: 191, merchant: "To Sofia Bauer", type: "debit", amount: -45.0, currency: "EUR", date: "Jun 30", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-SBAUER-0630" },
  { id: 230, merchant: "Lime", type: "debit", amount: -3.1, currency: "EUR", date: "Jun 30", category: "Transport", status: "success", method: card.EUR, reference: "LIME-0630-0041" },
  // Jun 28
  { id: 187, merchant: "Currency Exchange", type: "credit", amount: 290.0, currency: "EUR", date: "Jun 28", category: "Exchange", status: "success", method: "GBP → EUR", reference: "FX-0628-3318", rate: "1 GBP = 1.17 EUR" },
  { id: 184, merchant: "From Eva Lindqvist", type: "credit", amount: 70.0, currency: "EUR", date: "Jun 28", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-ELINDQVIST-0628" },
  { id: 185, merchant: "Zara", type: "debit", amount: -59.99, currency: "EUR", date: "Jun 28", category: "Shopping", status: "success", method: card.EUR, reference: "ZARA-0628-3301" },
  { id: 186, merchant: "Uber", type: "debit", amount: -14.2, currency: "USD", date: "Jun 28", category: "Transport", status: "success", method: card.USD, reference: "UBER-0628-9920" },
  { id: 231, merchant: "Pret A Manger", type: "debit", amount: -7.8, currency: "GBP", date: "Jun 28", category: "Food", status: "success", method: card.GBP, reference: "PRET-0628-1144" },
  // Jun 26
  { id: 181, merchant: "From Hugo Martin", type: "credit", amount: 65.0, currency: "EUR", date: "Jun 26", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-HMARTIN-0626" },
  { id: 182, merchant: "Lidl", type: "debit", amount: -32.4, currency: "EUR", date: "Jun 26", category: "Shopping", status: "success", method: card.EUR, reference: "LIDL-0626-5541" },
  { id: 183, merchant: "Disney+", type: "debit", amount: -8.99, currency: "GBP", date: "Jun 26", category: "Entertainment", status: "success", method: card.GBP, reference: "DSNY-0626-2281" },
  { id: 232, merchant: "Bolt", type: "debit", amount: -6.4, currency: "EUR", date: "Jun 26", category: "Transport", status: "success", method: card.EUR, reference: "BOLT-0626-5510" },
  // Jun 25
  { id: 178, merchant: "From Marco Rossi", type: "credit", amount: 110.0, currency: "EUR", date: "Jun 25", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-MROSSI-0625" },
  { id: 179, merchant: "Starbucks", type: "debit", amount: -6.3, currency: "GBP", date: "Jun 25", category: "Food", status: "success", method: card.GBP, reference: "SBUX-0625-4402" },
  { id: 180, merchant: "App Store", type: "debit", amount: -4.99, currency: "USD", date: "Jun 25", category: "Shopping", status: "success", method: card.USD, reference: "APPL-APPSTORE-0625" },
  { id: 233, merchant: "Audible", type: "debit", amount: -7.99, currency: "GBP", date: "Jun 25", category: "Entertainment", status: "success", method: card.GBP, reference: "AMZ-AUDIBLE-0625" },
  // Jun 23
  { id: 174, merchant: "From Tomas Novak", type: "credit", amount: 95.0, currency: "EUR", date: "Jun 23", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-TNOVAK-0623" },
  { id: 175, merchant: "ASOS", type: "debit", amount: -48.5, currency: "GBP", date: "Jun 23", category: "Shopping", status: "success", method: card.GBP, reference: "ASOS-0623-8830" },
  { id: 176, merchant: "Google Play Top-up", type: "debit", amount: -7.99, currency: "GBP", date: "Jun 23", category: "Top-up", status: "success", method: "Wallet top-up", reference: "TOPUP-GPLAY-0623" },
  { id: 177, merchant: "Bolt", type: "debit", amount: -5.2, currency: "EUR", date: "Jun 23", category: "Transport", status: "success", method: card.EUR, reference: "BOLT-0623-7714" },
  // Jun 21
  { id: 171, merchant: "Freelance — Studio X", type: "credit", amount: 950.0, currency: "EUR", date: "Jun 21", category: "Income", status: "success", method: "Bank transfer", reference: "STUDIOX-INV-45" },
  { id: 170, merchant: "From Greta Hansen", type: "credit", amount: 85.0, currency: "EUR", date: "Jun 21", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-GHANSEN-0621" },
  { id: 172, merchant: "AliExpress", type: "debit", amount: -31.6, currency: "USD", date: "Jun 21", category: "Shopping", status: "success", method: card.USD, reference: "ALI-0621-5590" },
  { id: 173, merchant: "ATM withdrawal fee", type: "debit", amount: -3.5, currency: "EUR", date: "Jun 21", category: "Fees", status: "success", method: "Service charge", reference: "FEE-ATM-0621" },
  { id: 234, merchant: "Carrefour", type: "debit", amount: -29.8, currency: "EUR", date: "Jun 21", category: "Food", status: "success", method: card.EUR, reference: "CARR-0621-3391" },
  // Jun 20
  { id: 167, merchant: "From Elena Popov", type: "credit", amount: 120.0, currency: "EUR", date: "Jun 20", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-EPOPOV-0620" },
  { id: 168, merchant: "Vodafone Top-up", type: "debit", amount: -15.0, currency: "GBP", date: "Jun 20", category: "Top-up", status: "success", method: "Mobile top-up", reference: "TOPUP-VODA-0620" },
  { id: 169, merchant: "Pret A Manger", type: "debit", amount: -8.1, currency: "GBP", date: "Jun 20", category: "Food", status: "success", method: card.GBP, reference: "PRET-0620-1102" },
  { id: 235, merchant: "Trainline", type: "debit", amount: -22.5, currency: "GBP", date: "Jun 20", category: "Transport", status: "success", method: card.GBP, reference: "TRLN-0620-5581" },
  // Jun 18
  { id: 163, merchant: "From Isabella Conti", type: "credit", amount: 130.0, currency: "EUR", date: "Jun 18", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-ICONTI-0618" },
  { id: 164, merchant: "Ryanair", type: "debit", amount: -62.99, currency: "EUR", date: "Jun 18", category: "Travel", status: "success", method: card.EUR, reference: "RYAN-0618-4420" },
  { id: 165, merchant: "Amazon Prime", type: "debit", amount: -8.99, currency: "GBP", date: "Jun 18", category: "Entertainment", status: "success", method: card.GBP, reference: "AMZ-PRIME-0618" },
  { id: 166, merchant: "Lime", type: "debit", amount: -4.2, currency: "EUR", date: "Jun 18", category: "Transport", status: "success", method: card.EUR, reference: "LIME-0618-3309" },
  // Jun 16
  { id: 159, merchant: "From Jan Kowalczyk", type: "credit", amount: 175.0, currency: "EUR", date: "Jun 16", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-JKOWALCZYK-0616" },
  { id: 160, merchant: "To Lena Brandt", type: "debit", amount: -40.0, currency: "GBP", date: "Jun 16", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-LBRANDT-0616" },
  { id: 161, merchant: "Five Guys", type: "debit", amount: -18.5, currency: "USD", date: "Jun 16", category: "Food", status: "success", method: card.USD, reference: "FIVE-0616-7720" },
  { id: 162, merchant: "International transfer fee", type: "debit", amount: -4.99, currency: "GBP", date: "Jun 16", category: "Fees", status: "success", method: "Service charge", reference: "FEE-INTL-0616" },
  // Jun 15
  { id: 155, merchant: "From Sophie Dubois", type: "credit", amount: 100.0, currency: "EUR", date: "Jun 15", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-SDUBOIS-0615" },
  { id: 156, merchant: "Currency Exchange", type: "credit", amount: 320.0, currency: "USD", date: "Jun 15", category: "Exchange", status: "success", method: "GBP → USD", reference: "FX-0615-6610", rate: "1 GBP = 1.27 USD" },
  { id: 157, merchant: "Nike", type: "debit", amount: -74.99, currency: "EUR", date: "Jun 15", category: "Shopping", status: "success", method: card.EUR, reference: "NIKE-0615-1190" },
  { id: 158, merchant: "Audible", type: "debit", amount: -7.99, currency: "GBP", date: "Jun 15", category: "Entertainment", status: "success", method: card.GBP, reference: "AMZ-AUDIBLE-0615" },
  // Jun 13
  { id: 151, merchant: "From David Müller", type: "credit", amount: 140.0, currency: "EUR", date: "Jun 13", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-DMULLER-0613" },
  { id: 152, merchant: "Steam Wallet", type: "debit", amount: -20.0, currency: "USD", date: "Jun 13", category: "Top-up", status: "success", method: "Wallet top-up", reference: "TOPUP-STEAM-0613" },
  { id: 153, merchant: "Trainline", type: "debit", amount: -28.5, currency: "GBP", date: "Jun 13", category: "Transport", status: "success", method: card.GBP, reference: "TRLN-0613-2240" },
  { id: 154, merchant: "Carrefour", type: "debit", amount: -42.3, currency: "EUR", date: "Jun 13", category: "Food", status: "success", method: card.EUR, reference: "CARR-0613-9901" },
  // Jun 12
  { id: 1, merchant: "From Olivia Schmidt", type: "credit", amount: 180.0, currency: "EUR", date: "Jun 12", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-OSCHMIDT-0612" },
  { id: 3, merchant: "From Sofia Bauer", type: "credit", amount: 120.0, currency: "EUR", date: "Jun 12", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-SBAUER-0612" },
  { id: 5, merchant: "From James Carter", type: "credit", amount: 95.0, currency: "GBP", date: "Jun 12", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-JCARTER-0612" },
  { id: 2, merchant: "Spotify", type: "debit", amount: -9.99, currency: "GBP", date: "Jun 12", category: "Entertainment", status: "success", method: card.GBP, reference: "SPOT-0612-1183" },
  { id: 4, merchant: "Amazon", type: "debit", amount: -34.99, currency: "GBP", date: "Jun 12", category: "Shopping", status: "success", method: card.GBP, reference: "AMZ-0612-4471" },
  { id: 6, merchant: "Card maintenance fee", type: "debit", amount: -2.99, currency: "GBP", date: "Jun 12", category: "Fees", status: "success", method: "Service charge", reference: "FEE-CARD-0612" },
  { id: 7, merchant: "Pret A Manger", type: "debit", amount: -7.4, currency: "GBP", date: "Jun 12", category: "Food", status: "success", method: card.GBP, reference: "PRET-0612-0094" },
  // Jun 11
  { id: 8, merchant: "From Liam O'Brien", type: "credit", amount: 60.0, currency: "GBP", date: "Jun 11", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-LOBRIEN-0611" },
  { id: 12, merchant: "From Mia Larsson", type: "credit", amount: 75.0, currency: "EUR", date: "Jun 11", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-MLARSSON-0611" },
  { id: 9, merchant: "Apple Store", type: "debit", amount: -129.0, currency: "USD", date: "Jun 11", category: "Shopping", status: "success", method: card.USD, reference: "APPL-STORE-0611" },
  { id: 10, merchant: "To James Carter", type: "debit", amount: -120.0, currency: "GBP", date: "Jun 11", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-JCARTER-0611" },
  { id: 11, merchant: "Vodafone Top-up", type: "debit", amount: -15.0, currency: "GBP", date: "Jun 11", category: "Top-up", status: "success", method: "Mobile top-up", reference: "TOPUP-VODA-0611" },
  { id: 13, merchant: "Lidl", type: "debit", amount: -28.65, currency: "EUR", date: "Jun 11", category: "Shopping", status: "success", method: card.EUR, reference: "LIDL-0611-7741" },
  { id: 14, merchant: "Uber", type: "debit", amount: -12.3, currency: "USD", date: "Jun 11", category: "Transport", status: "success", method: card.USD, reference: "UBER-0611-3320" },
  // Jun 10
  { id: 15, merchant: "Salary — Northwind Ltd", type: "credit", amount: 2450.0, currency: "GBP", date: "Jun 10", category: "Income", status: "success", method: "Bank transfer", reference: "NW-PAYROLL-0610" },
  { id: 16, merchant: "From Hugo Martin", type: "credit", amount: 48.0, currency: "EUR", date: "Jun 10", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-HMARTIN-0610" },
  { id: 17, merchant: "App Store", type: "debit", amount: -4.99, currency: "USD", date: "Jun 10", category: "Shopping", status: "success", method: card.USD, reference: "APPL-APPSTORE-0610" },
  { id: 18, merchant: "Deliveroo", type: "debit", amount: -19.8, currency: "GBP", date: "Jun 10", category: "Food", status: "success", method: card.GBP, reference: "DLVR-0610-8852" },
  { id: 19, merchant: "ATM withdrawal fee", type: "debit", amount: -3.5, currency: "EUR", date: "Jun 10", category: "Fees", status: "success", method: "Service charge", reference: "FEE-ATM-0610" },
  // Jun 9
  { id: 20, merchant: "From David Müller", type: "credit", amount: 220.0, currency: "EUR", date: "Jun 9", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-DMULLER-0609" },
  { id: 21, merchant: "From Elena Popov", type: "credit", amount: 130.0, currency: "EUR", date: "Jun 9", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-EPOPOV-0609" },
  { id: 22, merchant: "PlayStation Top-up", type: "debit", amount: -20.0, currency: "USD", date: "Jun 9", category: "Top-up", status: "success", method: "Wallet top-up", reference: "TOPUP-PSN-0609" },
  { id: 23, merchant: "Netflix", type: "debit", amount: -15.99, currency: "USD", date: "Jun 9", category: "Entertainment", status: "success", method: card.USD, reference: "NFLX-0609-2026" },
  { id: 24, merchant: "Zara", type: "debit", amount: -64.99, currency: "EUR", date: "Jun 9", category: "Shopping", status: "success", method: card.EUR, reference: "ZARA-0609-4410" },
  { id: 25, merchant: "Bolt", type: "debit", amount: -4.5, currency: "EUR", date: "Jun 9", category: "Transport", status: "success", method: card.EUR, reference: "BOLT-0609-8821" },
  // Jun 8
  { id: 26, merchant: "From Tomas Novak", type: "credit", amount: 90.0, currency: "EUR", date: "Jun 8", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-TNOVAK-0608" },
  { id: 27, merchant: "To Lena Brandt", type: "debit", amount: -35.0, currency: "GBP", date: "Jun 8", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-LBRANDT-0608" },
  { id: 28, merchant: "Amazon Prime", type: "debit", amount: -8.99, currency: "GBP", date: "Jun 8", category: "Entertainment", status: "success", method: card.GBP, reference: "AMZ-PRIME-0608" },
  { id: 29, merchant: "Starbucks", type: "debit", amount: -5.1, currency: "GBP", date: "Jun 8", category: "Food", status: "success", method: card.GBP, reference: "SBUX-0608-1170" },
  { id: 30, merchant: "International transfer fee", type: "debit", amount: -4.99, currency: "GBP", date: "Jun 8", category: "Fees", status: "success", method: "Service charge", reference: "FEE-INTL-0608" },
  // Jun 7
  { id: 31, merchant: "Currency Exchange", type: "credit", amount: 345.0, currency: "EUR", date: "Jun 7", category: "Exchange", status: "success", method: "GBP → EUR", reference: "FX-0607-5582", rate: "1 GBP = 1.17 EUR" },
  { id: 32, merchant: "From Felix Weber", type: "credit", amount: 55.0, currency: "EUR", date: "Jun 7", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-FWEBER-0607" },
  { id: 33, merchant: "To Noah Fischer", type: "debit", amount: -50.0, currency: "USD", date: "Jun 7", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-NFISCHER-0607" },
  { id: 34, merchant: "Uniqlo", type: "debit", amount: -78.0, currency: "GBP", date: "Jun 7", category: "Shopping", status: "success", method: card.GBP, reference: "UNQ-0607-1182" },
  // Jun 6
  { id: 35, merchant: "From Klara Nowak", type: "credit", amount: 110.0, currency: "EUR", date: "Jun 6", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-KNOWAK-0606" },
  { id: 36, merchant: "Refund — Booking.com", type: "credit", amount: 96.4, currency: "USD", date: "Jun 6", category: "Travel", status: "success", method: card.USD, reference: "BKNG-RFND-0606" },
  { id: 37, merchant: "From Emma Wilson", type: "credit", amount: 60.0, currency: "GBP", date: "Jun 6", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-EWILSON-0606" },
  { id: 38, merchant: "Steam Wallet", type: "debit", amount: -25.0, currency: "USD", date: "Jun 6", category: "Top-up", status: "success", method: "Wallet top-up", reference: "TOPUP-STEAM-0606" },
  { id: 39, merchant: "Five Guys", type: "debit", amount: -16.2, currency: "USD", date: "Jun 6", category: "Food", status: "success", method: card.USD, reference: "FIVE-0606-3391" },
  // Jun 5
  { id: 40, merchant: "From Isabella Conti", type: "credit", amount: 145.0, currency: "EUR", date: "Jun 5", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-ICONTI-0605" },
  { id: 43, merchant: "From Sophie Dubois", type: "credit", amount: 85.0, currency: "EUR", date: "Jun 5", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-SDUBOIS-0605" },
  { id: 41, merchant: "EE Mobile Top-up", type: "debit", amount: -10.0, currency: "GBP", date: "Jun 5", category: "Top-up", status: "success", method: "Mobile top-up", reference: "TOPUP-EE-0605" },
  { id: 42, merchant: "iTunes", type: "debit", amount: -12.99, currency: "USD", date: "Jun 5", category: "Entertainment", status: "success", method: card.USD, reference: "APPL-ITUNES-0605" },
  // Jun 4
  { id: 44, merchant: "From Daniel Cohen", type: "credit", amount: 200.0, currency: "USD", date: "Jun 4", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-DCOHEN-0604" },
  { id: 45, merchant: "Ryanair", type: "debit", amount: -54.99, currency: "EUR", date: "Jun 4", category: "Travel", status: "success", method: card.EUR, reference: "RYAN-0604-7720" },
  { id: 46, merchant: "AliExpress", type: "debit", amount: -28.4, currency: "USD", date: "Jun 4", category: "Shopping", status: "success", method: card.USD, reference: "ALI-0604-3380" },
  { id: 47, merchant: "Currency conversion fee", type: "debit", amount: -1.2, currency: "USD", date: "Jun 4", category: "Fees", status: "success", method: "Service charge", reference: "FEE-FX-0604" },
  { id: 48, merchant: "Tesco", type: "debit", amount: -41.27, currency: "GBP", date: "Jun 4", category: "Food", status: "success", method: card.GBP, reference: "TESC-0604-9912" },
  // Jun 3
  { id: 49, merchant: "From Jan Kowalczyk", type: "credit", amount: 160.0, currency: "EUR", date: "Jun 3", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-JKOWALCZYK-0603" },
  { id: 52, merchant: "From Eva Lindqvist", type: "credit", amount: 70.0, currency: "EUR", date: "Jun 3", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-ELINDQVIST-0603" },
  { id: 50, merchant: "To Anna Kowalski", type: "debit", amount: -90.0, currency: "EUR", date: "Jun 3", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-AKOWALSKI-0603" },
  { id: 51, merchant: "Google Play Top-up", type: "debit", amount: -7.99, currency: "GBP", date: "Jun 3", category: "Top-up", status: "success", method: "Wallet top-up", reference: "TOPUP-GPLAY-0603" },
  // Jun 2
  { id: 53, merchant: "Freelance — Studio X", type: "credit", amount: 850.0, currency: "EUR", date: "Jun 2", category: "Income", status: "success", method: "Bank transfer", reference: "STUDIOX-INV-44" },
  { id: 54, merchant: "Currency Exchange", type: "credit", amount: 260.0, currency: "USD", date: "Jun 2", category: "Exchange", status: "success", method: "EUR → USD", reference: "FX-0602-2210", rate: "1 EUR = 1.08 USD" },
  { id: 56, merchant: "From Sophie Dubois", type: "credit", amount: 50.0, currency: "GBP", date: "Jun 2", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-SDUBOIS-0602" },
  { id: 55, merchant: "Steam", type: "debit", amount: -29.99, currency: "USD", date: "Jun 2", category: "Entertainment", status: "success", method: card.USD, reference: "STEAM-0602-5521" },
  { id: 239, merchant: "Starbucks", type: "debit", amount: -6.7, currency: "GBP", date: "Jun 2", category: "Food", status: "success", method: card.GBP, reference: "SBUX-0602-3301" },
  // Jun 1
  { id: 57, merchant: "From Pavel Horvath", type: "credit", amount: 125.0, currency: "EUR", date: "Jun 1", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-PHORVATH-0601" },
  { id: 59, merchant: "From Lena Brandt", type: "credit", amount: 40.0, currency: "GBP", date: "Jun 1", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-LBRANDT-0601" },
  { id: 58, merchant: "IKEA", type: "debit", amount: -132.4, currency: "EUR", date: "Jun 1", category: "Shopping", status: "success", method: card.EUR, reference: "IKEA-0601-2240" },
  { id: 60, merchant: "TfL", type: "debit", amount: -16.6, currency: "GBP", date: "Jun 1", category: "Transport", status: "success", method: card.GBP, reference: "TFL-0601-8830" },
  // May 31
  { id: 61, merchant: "From Greta Hansen", type: "credit", amount: 95.0, currency: "EUR", date: "May 31", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-GHANSEN-0531" },
  { id: 62, merchant: "Cashback reward", type: "credit", amount: 4.25, currency: "GBP", date: "May 31", category: "Income", status: "success", method: "Rewards", reference: "CASHBACK-0531" },
  { id: 63, merchant: "Amazon", type: "debit", amount: -57.3, currency: "EUR", date: "May 31", category: "Shopping", status: "success", method: card.EUR, reference: "AMZ-0531-1129" },
  { id: 64, merchant: "To Lucas Bianchi", type: "debit", amount: -45.0, currency: "EUR", date: "May 31", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-LBIANCHI-0531" },
  // May 30
  { id: 65, merchant: "From Mateo Garcia", type: "credit", amount: 180.0, currency: "EUR", date: "May 30", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-MGARCIA-0530" },
  { id: 66, merchant: "Airbnb", type: "debit", amount: -210.0, currency: "USD", date: "May 30", category: "Travel", status: "success", method: card.USD, reference: "ABNB-0530-7741" },
  { id: 67, merchant: "Lyca Mobile Top-up", type: "debit", amount: -12.0, currency: "GBP", date: "May 30", category: "Top-up", status: "success", method: "Mobile top-up", reference: "TOPUP-LYCA-0530" },
  { id: 68, merchant: "Monthly account fee", type: "debit", amount: -5.0, currency: "GBP", date: "May 30", category: "Fees", status: "success", method: "Service charge", reference: "FEE-MONTH-0530" },
  { id: 69, merchant: "Carrefour", type: "debit", amount: -38.9, currency: "EUR", date: "May 30", category: "Food", status: "success", method: card.EUR, reference: "CARR-0530-1102" },
  // May 28
  { id: 70, merchant: "From Marco Rossi", type: "credit", amount: 75.0, currency: "GBP", date: "May 28", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-MROSSI-0528" },
  { id: 71, merchant: "To David Müller", type: "debit", amount: -60.0, currency: "EUR", date: "May 28", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-DMULLER-0528" },
  { id: 72, merchant: "Apple.com", type: "debit", amount: -49.0, currency: "USD", date: "May 28", category: "Shopping", status: "success", method: card.USD, reference: "APPL-COM-0528" },
  { id: 73, merchant: "ASOS", type: "debit", amount: -64.5, currency: "GBP", date: "May 28", category: "Shopping", status: "success", method: card.GBP, reference: "ASOS-0528-7714" },
  // May 27
  { id: 74, merchant: "From Noah Fischer", type: "credit", amount: 40.0, currency: "USD", date: "May 27", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-NFISCHER-0527" },
  { id: 75, merchant: "Amazon", type: "debit", amount: -42.8, currency: "EUR", date: "May 27", category: "Shopping", status: "success", method: card.EUR, reference: "AMZ-0527-9914" },
  { id: 76, merchant: "To Sofia Bauer", type: "debit", amount: -55.0, currency: "EUR", date: "May 27", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-SBAUER-0527" },
  { id: 77, merchant: "Disney+", type: "debit", amount: -8.99, currency: "GBP", date: "May 27", category: "Entertainment", status: "success", method: card.GBP, reference: "DSNY-0527-3306" },
  // May 26
  { id: 78, merchant: "Currency Exchange", type: "credit", amount: 410.0, currency: "EUR", date: "May 26", category: "Exchange", status: "success", method: "GBP → EUR", reference: "FX-0526-9912", rate: "1 GBP = 1.17 EUR" },
  { id: 79, merchant: "From Olivia Schmidt", type: "credit", amount: 130.0, currency: "EUR", date: "May 26", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-OSCHMIDT-0526" },
  { id: 80, merchant: "Three Top-up", type: "debit", amount: -15.0, currency: "GBP", date: "May 26", category: "Top-up", status: "success", method: "Mobile top-up", reference: "TOPUP-THREE-0526" },
  { id: 81, merchant: "Audible", type: "debit", amount: -7.99, currency: "GBP", date: "May 26", category: "Entertainment", status: "success", method: card.GBP, reference: "AMZ-AUDIBLE-0526" },
  // May 24
  { id: 82, merchant: "From Klara Nowak", type: "credit", amount: 60.0, currency: "EUR", date: "May 24", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-KNOWAK-0524" },
  { id: 83, merchant: "To James Carter", type: "debit", amount: -65.0, currency: "GBP", date: "May 24", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-JCARTER-0524" },
  { id: 84, merchant: "eBay", type: "debit", amount: -22.75, currency: "GBP", date: "May 24", category: "Shopping", status: "success", method: card.GBP, reference: "EBAY-0524-4419" },
  { id: 85, merchant: "Trainline", type: "debit", amount: -33.5, currency: "GBP", date: "May 24", category: "Transport", status: "success", method: card.GBP, reference: "TRLN-0524-4471" },
  // May 22
  { id: 86, merchant: "From Daniel Cohen", type: "credit", amount: 175.0, currency: "USD", date: "May 22", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-DCOHEN-0522" },
  { id: 89, merchant: "From Felix Weber", type: "credit", amount: 48.0, currency: "EUR", date: "May 22", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-FWEBER-0522" },
  { id: 87, merchant: "Xbox Top-up", type: "debit", amount: -25.0, currency: "USD", date: "May 22", category: "Top-up", status: "success", method: "Wallet top-up", reference: "TOPUP-XBOX-0522" },
  { id: 88, merchant: "Nike", type: "debit", amount: -89.99, currency: "EUR", date: "May 22", category: "Shopping", status: "success", method: card.EUR, reference: "NIKE-0522-2230" },
  // May 20
  { id: 90, merchant: "Salary — Northwind Ltd", type: "credit", amount: 2450.0, currency: "GBP", date: "May 20", category: "Income", status: "success", method: "Bank transfer", reference: "NW-PAYROLL-0520" },
  { id: 91, merchant: "From Elena Popov", type: "credit", amount: 140.0, currency: "EUR", date: "May 20", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-EPOPOV-0520" },
  { id: 92, merchant: "To Noah Fischer", type: "debit", amount: -30.0, currency: "USD", date: "May 20", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-NFISCHER-0520" },
  { id: 93, merchant: "H&M", type: "debit", amount: -49.99, currency: "EUR", date: "May 20", category: "Shopping", status: "success", method: card.EUR, reference: "HM-0520-7782" },
  // May 18
  { id: 94, merchant: "From Mia Larsson", type: "credit", amount: 65.0, currency: "EUR", date: "May 18", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-MLARSSON-0518" },
  { id: 95, merchant: "Zalando", type: "debit", amount: -73.2, currency: "EUR", date: "May 18", category: "Shopping", status: "success", method: card.EUR, reference: "ZAL-0518-1190" },
  { id: 96, merchant: "App Store", type: "debit", amount: -2.99, currency: "USD", date: "May 18", category: "Shopping", status: "success", method: card.USD, reference: "APPL-APPSTORE-0518" },
  { id: 97, merchant: "Lebara Top-up", type: "debit", amount: -8.0, currency: "GBP", date: "May 18", category: "Top-up", status: "success", method: "Mobile top-up", reference: "TOPUP-LEBARA-0518" },
  // May 15
  { id: 98, merchant: "From Sofia Bauer", type: "credit", amount: 150.0, currency: "EUR", date: "May 15", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-SBAUER-0515" },
  { id: 99, merchant: "To Lena Brandt", type: "debit", amount: -25.0, currency: "GBP", date: "May 15", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-LBRANDT-0515" },
  { id: 100, merchant: "Eurostar", type: "debit", amount: -89.0, currency: "EUR", date: "May 15", category: "Travel", status: "success", method: card.EUR, reference: "EURO-0515-1190" },
  { id: 101, merchant: "Blue Bottle Coffee", type: "debit", amount: -6.2, currency: "USD", date: "May 15", category: "Food", status: "success", method: card.USD, reference: "BBC-0515-3391" },
  // May 13
  { id: 102, merchant: "From Tomas Novak", type: "credit", amount: 110.0, currency: "EUR", date: "May 13", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-TNOVAK-0513" },
  { id: 103, merchant: "Currency Exchange", type: "credit", amount: 230.0, currency: "USD", date: "May 13", category: "Exchange", status: "success", method: "GBP → USD", reference: "FX-0513-7740", rate: "1 GBP = 1.27 USD" },
  { id: 105, merchant: "From Mia Larsson", type: "credit", amount: 65.0, currency: "EUR", date: "May 13", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-MLARSSON-0513" },
  { id: 104, merchant: "Decathlon", type: "debit", amount: -44.9, currency: "EUR", date: "May 13", category: "Shopping", status: "success", method: card.EUR, reference: "DECA-0513-2218" },
  { id: 240, merchant: "Trainline", type: "debit", amount: -18.5, currency: "GBP", date: "May 13", category: "Transport", status: "success", method: card.GBP, reference: "TRLN-0513-8801" },
  // May 10
  { id: 106, merchant: "From Isabella Conti", type: "credit", amount: 120.0, currency: "EUR", date: "May 10", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-ICONTI-0510" },
  { id: 107, merchant: "Lufthansa", type: "debit", amount: -240.0, currency: "EUR", date: "May 10", category: "Travel", status: "success", method: card.EUR, reference: "LH-0510-5560" },
  { id: 108, merchant: "Card replacement fee", type: "debit", amount: -7.5, currency: "GBP", date: "May 10", category: "Fees", status: "success", method: "Service charge", reference: "FEE-REPL-0510" },
  { id: 109, merchant: "Lime", type: "debit", amount: -3.8, currency: "EUR", date: "May 10", category: "Transport", status: "success", method: card.EUR, reference: "LIME-0510-2204" },
  // May 8
  { id: 110, merchant: "From Jan Kowalczyk", type: "credit", amount: 95.0, currency: "EUR", date: "May 8", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-JKOWALCZYK-0508" },
  { id: 111, merchant: "PlayStation Top-up", type: "debit", amount: -30.0, currency: "USD", date: "May 8", category: "Top-up", status: "success", method: "Wallet top-up", reference: "TOPUP-PSN-0508" },
  { id: 112, merchant: "Amazon", type: "debit", amount: -61.4, currency: "GBP", date: "May 8", category: "Shopping", status: "success", method: card.GBP, reference: "AMZ-0508-3320" },
  { id: 113, merchant: "To Anna Kowalski", type: "debit", amount: -40.0, currency: "EUR", date: "May 8", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-AKOWALSKI-0508" },
  // May 6
  { id: 114, merchant: "From Eva Lindqvist", type: "credit", amount: 80.0, currency: "EUR", date: "May 6", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-ELINDQVIST-0506" },
  { id: 115, merchant: "MediaMarkt", type: "debit", amount: -319.0, currency: "EUR", date: "May 6", category: "Shopping", status: "success", method: card.EUR, reference: "MM-0506-8841" },
  { id: 116, merchant: "To Noah Fischer", type: "debit", amount: -30.0, currency: "USD", date: "May 6", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-NFISCHER-0506" },
  { id: 117, merchant: "Cinema City", type: "debit", amount: -24.0, currency: "GBP", date: "May 6", category: "Entertainment", status: "success", method: card.GBP, reference: "CINE-0506-1173" },
  // May 4
  { id: 118, merchant: "From Pavel Horvath", type: "credit", amount: 135.0, currency: "EUR", date: "May 4", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-PHORVATH-0504" },
  { id: 119, merchant: "Vodafone Top-up", type: "debit", amount: -20.0, currency: "GBP", date: "May 4", category: "Top-up", status: "success", method: "Mobile top-up", reference: "TOPUP-VODA-0504" },
  { id: 120, merchant: "iTunes", type: "debit", amount: -9.99, currency: "USD", date: "May 4", category: "Entertainment", status: "success", method: card.USD, reference: "APPL-ITUNES-0504" },
  // May 3
  { id: 121, merchant: "From David Müller", type: "credit", amount: 110.0, currency: "EUR", date: "May 3", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-DMULLER-0503" },
  { id: 122, merchant: "Shell", type: "debit", amount: -58.4, currency: "GBP", date: "May 3", category: "Transport", status: "success", method: card.GBP, reference: "SHEL-0503-9920" },
  { id: 123, merchant: "Deliveroo", type: "debit", amount: -22.1, currency: "GBP", date: "May 3", category: "Food", status: "success", method: card.GBP, reference: "DLVR-0503-4418" },
  // May 2
  { id: 124, merchant: "From Greta Hansen", type: "credit", amount: 90.0, currency: "EUR", date: "May 2", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-GHANSEN-0502" },
  { id: 125, merchant: "Dividend — Vanguard", type: "credit", amount: 37.5, currency: "GBP", date: "May 2", category: "Income", status: "success", method: "Bank transfer", reference: "DIV-VAN-0502" },
  { id: 126, merchant: "Apple Store", type: "debit", amount: -199.0, currency: "USD", date: "May 2", category: "Shopping", status: "success", method: card.USD, reference: "APPL-STORE-0502" },
  // May 1
  { id: 127, merchant: "Currency Exchange", type: "credit", amount: 300.0, currency: "USD", date: "May 1", category: "Exchange", status: "success", method: "GBP → USD", reference: "FX-0501-7731", rate: "1 GBP = 1.27 USD" },
  { id: 128, merchant: "From Mateo Garcia", type: "credit", amount: 150.0, currency: "EUR", date: "May 1", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-MGARCIA-0501" },
  { id: 129, merchant: "Tesco", type: "debit", amount: -36.75, currency: "GBP", date: "May 1", category: "Food", status: "success", method: card.GBP, reference: "TESC-0501-2200" },
  { id: 130, merchant: "ATM withdrawal fee", type: "debit", amount: -2.75, currency: "GBP", date: "May 1", category: "Fees", status: "success", method: "Service charge", reference: "FEE-ATM-0501" },
];

export interface Contact {
  id: number;
  name: string;
  handle: string;
  initials: string;
}

export const recentContacts: Contact[] = [
  { id: 1, name: "James", handle: "@james", initials: "JM" },
  { id: 2, name: "Lena", handle: "@lena_k", initials: "LK" },
  { id: 3, name: "Noah", handle: "@noah", initials: "NO" },
  { id: 4, name: "Sofia", handle: "@sofia", initials: "SF" },
  { id: 5, name: "Marco", handle: "@marco", initials: "MR" },
];

export const user = {
  name: "Izabela Kulma",
  firstName: "Izabela",
  email: "izabela.kulma@trip.app",
  initials: "IK",
};

/** Mask an email for verification screens, e.g. a••••••t@stash.app */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain || local.length < 2) return email;
  return `${local[0]}${"•".repeat(Math.max(local.length - 2, 1))}${
    local[local.length - 1]
  }@${domain}`;
}

export function formatAmount(amount: number, currency: CurrencyCode): string {
  const symbol = currencySymbol[currency];
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}
