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
    balance: 146.81,
    account: "•••• 4421",
    iban: "GB29 CLJU 0413 0742 4271 84",
    bic: "CLJUGB21",
    bank: "Clear Junction",
    holder: "Patryk Domański",
  },
  {
    currency: "GBP",
    symbol: "£",
    name: "British Pound",
    balance: 80.0,
    account: "•••• 7731",
    sortCode: "20-18-34",
    accountNo: "58739214",
    bank: "Barclays Bank UK",
    holder: "Patryk Domański",
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
    holder: "Patryk Domański",
  },
];

const card = { GBP: "Card •••• 7731", EUR: "Card •••• 4421", USD: "Card •••• 9902" };

export const transactions: Transaction[] = [
  // Today — Jun 12
  { id: 1, merchant: "From Olivia Schmidt", type: "credit", amount: 180.0, currency: "EUR", date: "Today", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-OSCHMIDT-0612" },
  { id: 2, merchant: "Spotify", type: "debit", amount: -9.99, currency: "GBP", date: "Today", category: "Entertainment", status: "success", method: card.GBP, reference: "SPOT-0612-1183" },
  { id: 3, merchant: "From Sofia Bauer", type: "credit", amount: 120.0, currency: "EUR", date: "Today", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-SBAUER-0612" },
  { id: 4, merchant: "Amazon", type: "debit", amount: -34.99, currency: "GBP", date: "Today", category: "Shopping", status: "success", method: card.GBP, reference: "AMZ-0612-4471" },
  { id: 5, merchant: "From James Carter", type: "credit", amount: 95.0, currency: "GBP", date: "Today", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-JCARTER-0612" },
  { id: 6, merchant: "Card maintenance fee", type: "debit", amount: -2.99, currency: "GBP", date: "Today", category: "Fees", status: "success", method: "Service charge", reference: "FEE-CARD-0612" },
  { id: 7, merchant: "Pret A Manger", type: "debit", amount: -7.4, currency: "GBP", date: "Today", category: "Food", status: "success", method: card.GBP, reference: "PRET-0612-0094" },
  // Yesterday — Jun 11
  { id: 8, merchant: "From Liam O'Brien", type: "credit", amount: 60.0, currency: "GBP", date: "Yesterday", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-LOBRIEN-0611" },
  { id: 9, merchant: "Apple Store", type: "debit", amount: -129.0, currency: "USD", date: "Yesterday", category: "Shopping", status: "success", method: card.USD, reference: "APPL-STORE-0611" },
  { id: 10, merchant: "To James Carter", type: "debit", amount: -120.0, currency: "GBP", date: "Yesterday", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-JCARTER-0611" },
  { id: 11, merchant: "Vodafone Top-up", type: "debit", amount: -15.0, currency: "GBP", date: "Yesterday", category: "Top-up", status: "success", method: "Mobile top-up", reference: "TOPUP-VODA-0611" },
  { id: 12, merchant: "From Mia Larsson", type: "credit", amount: 75.0, currency: "EUR", date: "Yesterday", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-MLARSSON-0611" },
  { id: 13, merchant: "Lidl", type: "debit", amount: -28.65, currency: "EUR", date: "Yesterday", category: "Shopping", status: "success", method: card.EUR, reference: "LIDL-0611-7741" },
  { id: 14, merchant: "Uber", type: "debit", amount: -12.3, currency: "USD", date: "Yesterday", category: "Transport", status: "success", method: card.USD, reference: "UBER-0611-3320" },
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
  { id: 41, merchant: "EE Mobile Top-up", type: "debit", amount: -10.0, currency: "GBP", date: "Jun 5", category: "Top-up", status: "success", method: "Mobile top-up", reference: "TOPUP-EE-0605" },
  { id: 42, merchant: "iTunes", type: "debit", amount: -12.99, currency: "USD", date: "Jun 5", category: "Entertainment", status: "success", method: card.USD, reference: "APPL-ITUNES-0605" },
  { id: 43, merchant: "From Sophie Dubois", type: "credit", amount: 85.0, currency: "EUR", date: "Jun 5", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-SDUBOIS-0605" },
  // Jun 4
  { id: 44, merchant: "From Daniel Cohen", type: "credit", amount: 200.0, currency: "USD", date: "Jun 4", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-DCOHEN-0604" },
  { id: 45, merchant: "Ryanair", type: "debit", amount: -54.99, currency: "EUR", date: "Jun 4", category: "Travel", status: "success", method: card.EUR, reference: "RYAN-0604-7720" },
  { id: 46, merchant: "AliExpress", type: "debit", amount: -28.4, currency: "USD", date: "Jun 4", category: "Shopping", status: "success", method: card.USD, reference: "ALI-0604-3380" },
  { id: 47, merchant: "Currency conversion fee", type: "debit", amount: -1.2, currency: "USD", date: "Jun 4", category: "Fees", status: "success", method: "Service charge", reference: "FEE-FX-0604" },
  { id: 48, merchant: "Tesco", type: "debit", amount: -41.27, currency: "GBP", date: "Jun 4", category: "Food", status: "success", method: card.GBP, reference: "TESC-0604-9912" },
  // Jun 3
  { id: 49, merchant: "From Jan Kowalczyk", type: "credit", amount: 160.0, currency: "EUR", date: "Jun 3", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-JKOWALCZYK-0603" },
  { id: 50, merchant: "To Anna Kowalski", type: "debit", amount: -90.0, currency: "EUR", date: "Jun 3", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-AKOWALSKI-0603" },
  { id: 51, merchant: "Google Play Top-up", type: "debit", amount: -7.99, currency: "GBP", date: "Jun 3", category: "Top-up", status: "success", method: "Wallet top-up", reference: "TOPUP-GPLAY-0603" },
  { id: 52, merchant: "From Eva Lindqvist", type: "credit", amount: 70.0, currency: "EUR", date: "Jun 3", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-ELINDQVIST-0603" },
  // Jun 2
  { id: 53, merchant: "Freelance — Studio X", type: "credit", amount: 850.0, currency: "EUR", date: "Jun 2", category: "Income", status: "success", method: "Bank transfer", reference: "STUDIOX-INV-44" },
  { id: 54, merchant: "Currency Exchange", type: "credit", amount: 260.0, currency: "USD", date: "Jun 2", category: "Exchange", status: "success", method: "EUR → USD", reference: "FX-0602-2210", rate: "1 EUR = 1.08 USD" },
  { id: 55, merchant: "Steam", type: "debit", amount: -29.99, currency: "USD", date: "Jun 2", category: "Entertainment", status: "success", method: card.USD, reference: "STEAM-0602-5521" },
  { id: 56, merchant: "From Sophie Dubois", type: "credit", amount: 50.0, currency: "GBP", date: "Jun 2", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-SDUBOIS-0602" },
  // Jun 1
  { id: 57, merchant: "From Pavel Horvath", type: "credit", amount: 125.0, currency: "EUR", date: "Jun 1", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-PHORVATH-0601" },
  { id: 58, merchant: "IKEA", type: "debit", amount: -132.4, currency: "EUR", date: "Jun 1", category: "Shopping", status: "success", method: card.EUR, reference: "IKEA-0601-2240" },
  { id: 59, merchant: "From Lena Brandt", type: "credit", amount: 40.0, currency: "GBP", date: "Jun 1", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-LBRANDT-0601" },
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
  { id: 87, merchant: "Xbox Top-up", type: "debit", amount: -25.0, currency: "USD", date: "May 22", category: "Top-up", status: "success", method: "Wallet top-up", reference: "TOPUP-XBOX-0522" },
  { id: 88, merchant: "Nike", type: "debit", amount: -89.99, currency: "EUR", date: "May 22", category: "Shopping", status: "success", method: card.EUR, reference: "NIKE-0522-2230" },
  { id: 89, merchant: "From Felix Weber", type: "credit", amount: 48.0, currency: "EUR", date: "May 22", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-FWEBER-0522" },
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
  { id: 104, merchant: "Decathlon", type: "debit", amount: -44.9, currency: "EUR", date: "May 13", category: "Shopping", status: "success", method: card.EUR, reference: "DECA-0513-2218" },
  { id: 105, merchant: "From Mia Larsson", type: "credit", amount: 65.0, currency: "EUR", date: "May 13", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-MLARSSON-0513" },
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
  name: "Patryk Domański",
  firstName: "Patryk",
  email: "patryk.domanski@stash.app",
  initials: "PD",
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
