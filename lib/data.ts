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
  /** HH:MM 24-hour time the transaction was processed */
  time: string;
  category: TxCategory;
  status: "success" | "pending";
  method: string;
  reference: string;
  rate?: string;
  /**
   * For a credit: IDs of the debit transactions (spending + charges) that
   * this incoming money was used for — shows the full spending trail.
   * For a debit that is part of such a trail: ID of the parent credit.
   */
  relatedIds?: number[];
  /** ID of the credit that funded this debit (reverse link). */
  creditId?: number;
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
    balance: 14820.55,
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
    balance: 9347.80,
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
    balance: 6215.40,
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
  // Credits arrive first (early morning bank processing), then debits through the day
  // EUR credit 220 → spent on Electricity bill (226) + Deliveroo (224)
  { id: 220, merchant: "Freelance — Apex Digital", type: "credit", amount: 4800.0, currency: "EUR", date: "Today", time: "08:14", category: "Income", status: "success", method: "Bank transfer", reference: "APEX-INV-0706-001", relatedIds: [226, 224] },
  // GBP credit 222 → spent on TfL (225) + Card Top-up (227)
  { id: 222, merchant: "Client Payment — Mercer & Co", type: "credit", amount: 3250.0, currency: "GBP", date: "Today", time: "08:51", category: "Income", status: "success", method: "Bank transfer", reference: "MERCER-INV-0706-88", relatedIds: [225, 227] },
  { id: 224, merchant: "Deliveroo", type: "debit", amount: -1340.0, currency: "EUR", date: "Today", time: "12:33", category: "Food", status: "success", method: card.EUR, reference: "DLVR-0706-0091", creditId: 220 },
  { id: 225, merchant: "TfL Oyster Card Top-up", type: "debit", amount: -1500.0, currency: "GBP", date: "Today", time: "09:07", category: "Top-up", status: "success", method: card.GBP, reference: "TFL-0706-2201", creditId: 222 },
  { id: 226, merchant: "Electricity Bill — Jul 2026", type: "debit", amount: -2100.0, currency: "EUR", date: "Today", time: "10:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "UTIL-0706-JUL26", creditId: 220 },
  { id: 227, merchant: "Visa Card Top-up", type: "debit", amount: -1200.0, currency: "GBP", date: "Today", time: "11:20", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-VISA-0706", creditId: 222 },
  // Yesterday — Jul 5
  // Credits: Wire In (USD), VentureTech (EUR) — both arrive early
  // USD credit 216 → spent on Wire transfer to Anna (217)
  { id: 216, merchant: "Wire In — Goldstein Partners", type: "credit", amount: 7500.0, currency: "USD", date: "Yesterday", time: "07:58", category: "Income", status: "success", method: "Bank transfer", reference: "GOLD-WIRE-IN-0705", relatedIds: [217] },
  // EUR credit 214 → spent on services payment (215)
  { id: 214, merchant: "Supplier Payment — VentureTech", type: "credit", amount: 5200.0, currency: "EUR", date: "Yesterday", time: "08:22", category: "Transfer", status: "success", method: "Bank transfer", reference: "VT-PAY-IN-0705-332", relatedIds: [215] },
  { id: 218, merchant: "Mastercard Top-up", type: "debit", amount: -2000.0, currency: "GBP", date: "Yesterday", time: "09:05", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-MC-0705" },
  { id: 217, merchant: "To Anna Kowalski", type: "debit", amount: -4800.0, currency: "USD", date: "Yesterday", time: "11:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-AKOWALSKI-0705", creditId: 216 },
  { id: 219, merchant: "Internet & TV Services", type: "debit", amount: -1800.0, currency: "GBP", date: "Yesterday", time: "13:00", category: "Transfer", status: "success", method: card.GBP, reference: "SERVICES-0705-4471" },
  { id: 215, merchant: "Cloud Hosting Services", type: "debit", amount: -3100.0, currency: "EUR", date: "Yesterday", time: "19:44", category: "Transfer", status: "success", method: "Bank transfer", reference: "CLOUD-SVC-0705-0071", creditId: 214 },
  // Jul 4
  // GBP credit 208 → Amazon (210) + Card fee (212)
  { id: 208, merchant: "Invoice — Stratford Studio", type: "credit", amount: 6400.0, currency: "GBP", date: "Jul 4", time: "08:05", category: "Income", status: "success", method: "Bank transfer", reference: "STRAT-INV-0704-19", relatedIds: [210, 212] },
  // EUR credit 209 → Deposit top-up (211)
  { id: 209, merchant: "Bank Deposit — Klara Nowak", type: "credit", amount: 2500.0, currency: "EUR", date: "Jul 4", time: "09:17", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-KNOWAK-0704", relatedIds: [211] },
  { id: 210, merchant: "Amazon Business", type: "debit", amount: -3200.0, currency: "GBP", date: "Jul 4", time: "10:42", category: "Shopping", status: "success", method: card.GBP, reference: "AMZ-0704-5512", creditId: 208 },
  { id: 211, merchant: "Savings Deposit", type: "debit", amount: -1800.0, currency: "EUR", date: "Jul 4", time: "13:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "SAVE-DEP-0704-0041", creditId: 209 },
  { id: 212, merchant: "Card maintenance fee", type: "debit", amount: -2.99, currency: "GBP", date: "Jul 4", time: "00:01", category: "Fees", status: "success", method: "Service charge", reference: "FEE-CARD-0704", creditId: 208 },
  // Jul 3
  // EUR credits 204+207 → Services (205)
  { id: 204, merchant: "Deposit — Mia Larsson", type: "credit", amount: 3500.0, currency: "EUR", date: "Jul 3", time: "07:50", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-MLARSSON-0703", relatedIds: [205] },
  { id: 207, merchant: "From Olivia Schmidt", type: "credit", amount: 4200.0, currency: "EUR", date: "Jul 3", time: "08:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-OSCHMIDT-0703" },
  { id: 205, merchant: "Software Licences", type: "debit", amount: -2800.0, currency: "EUR", date: "Jul 3", time: "13:02", category: "Transfer", status: "success", method: "Bank transfer", reference: "SWLIC-0703-0041", creditId: 204 },
  { id: 206, merchant: "Debit Card Top-up", type: "debit", amount: -1500.0, currency: "GBP", date: "Jul 3", time: "13:00", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-DEBIT-0703" },
  { id: 228, merchant: "Rail Season Ticket", type: "debit", amount: -2400.0, currency: "GBP", date: "Jul 3", time: "09:18", category: "Transport", status: "success", method: card.GBP, reference: "RAIL-SEASON-0703" },
  // Jul 2
  // EUR credit 201 → Renovation deposit (229)
  { id: 201, merchant: "Wire In — Felix Weber", type: "credit", amount: 8000.0, currency: "EUR", date: "Jul 2", time: "08:40", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-FWEBER-0702", relatedIds: [229] },
  { id: 200, merchant: "Amazon Bulk Order", type: "debit", amount: -4700.0, currency: "GBP", date: "Jul 2", time: "10:15", category: "Shopping", status: "success", method: card.GBP, reference: "AMZ-0702-8812" },
  { id: 202, merchant: "Car Insurance Payment", type: "debit", amount: -3100.0, currency: "GBP", date: "Jul 2", time: "08:52", category: "Transfer", status: "success", method: card.GBP, reference: "INS-CAR-0702-5530" },
  { id: 203, merchant: "Card maintenance fee", type: "debit", amount: -2.99, currency: "GBP", date: "Jul 2", time: "00:01", category: "Fees", status: "success", method: "Service charge", reference: "FEE-CARD-0702" },
  { id: 229, merchant: "Home Renovation Deposit", type: "debit", amount: -5500.0, currency: "EUR", date: "Jul 2", time: "19:55", category: "Transfer", status: "success", method: "Bank transfer", reference: "RENO-DEP-0702-0055", creditId: 201 },
  // Jul 1
  // GBP credit 192 → Mortgage (193) + Monthly fee (195)
  { id: 192, merchant: "Salary — Northwind Ltd", type: "credit", amount: 7800.0, currency: "GBP", date: "Jul 1", time: "07:00", category: "Income", status: "success", method: "Bank transfer", reference: "NW-PAYROLL-0701", relatedIds: [193, 195] },
  // EUR credit 194 (standalone deposit)
  { id: 194, merchant: "Bank Deposit — Klara Nowak", type: "credit", amount: 3000.0, currency: "EUR", date: "Jul 1", time: "09:33", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-KNOWAK-0701" },
  { id: 193, merchant: "Mortgage Payment — Jul", type: "debit", amount: -2200.0, currency: "GBP", date: "Jul 1", time: "11:47", category: "Transfer", status: "success", method: "Bank transfer", reference: "MORT-0701-3310", creditId: 192 },
  { id: 195, merchant: "Monthly account fee", type: "debit", amount: -5.0, currency: "GBP", date: "Jul 1", time: "00:01", category: "Fees", status: "success", method: "Service charge", reference: "FEE-MONTH-0701", creditId: 192 },
  // Jun 30
  // USD credit 188 → Card top-up (190)
  { id: 188, merchant: "Wire In — Daniel Cohen", type: "credit", amount: 9200.0, currency: "USD", date: "Jun 30", time: "08:10", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-DCOHEN-0630", relatedIds: [190] },
  { id: 189, merchant: "Prepaid Card Top-up", type: "debit", amount: -3500.0, currency: "GBP", date: "Jun 30", time: "19:30", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-PRE-0630" },
  { id: 190, merchant: "Mastercard Prepaid Top-up", type: "debit", amount: -6000.0, currency: "USD", date: "Jun 30", time: "13:00", category: "Top-up", status: "success", method: card.USD, reference: "TOPUP-MC-0630", creditId: 188 },
  { id: 191, merchant: "To Sofia Bauer", type: "debit", amount: -2800.0, currency: "EUR", date: "Jun 30", time: "11:22", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-SBAUER-0630" },
  { id: 230, merchant: "Broadband Services", type: "debit", amount: -1600.0, currency: "EUR", date: "Jun 30", time: "17:05", category: "Transfer", status: "success", method: card.EUR, reference: "BROAD-SVC-0630" },
  // Jun 28
  // EUR exchange credit 187 + EUR credit 184 → Investment deposit (185)
  { id: 187, merchant: "Currency Exchange", type: "credit", amount: 5800.0, currency: "EUR", date: "Jun 28", time: "09:00", category: "Exchange", status: "success", method: "GBP → EUR", reference: "FX-0628-3318", rate: "1 GBP = 1.17 EUR", relatedIds: [185] },
  { id: 184, merchant: "Deposit — Eva Lindqvist", type: "credit", amount: 4200.0, currency: "EUR", date: "Jun 28", time: "10:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-ELINDQVIST-0628" },
  { id: 185, merchant: "Investment Deposit", type: "debit", amount: -4900.0, currency: "EUR", date: "Jun 28", time: "14:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "INVEST-DEP-0628-3301", creditId: 187 },
  { id: 186, merchant: "Uber Business", type: "debit", amount: -1400.0, currency: "USD", date: "Jun 28", time: "20:10", category: "Transport", status: "success", method: card.USD, reference: "UBER-0628-9920" },
  { id: 231, merchant: "Annual Insurance Premium", type: "debit", amount: -3200.0, currency: "GBP", date: "Jun 28", time: "08:35", category: "Transfer", status: "success", method: card.GBP, reference: "INS-ANN-0628" },
  // Jun 26
  // EUR credit 181 → Rent payment (182) + services (232)
  { id: 181, merchant: "Wire In — Hugo Martin", type: "credit", amount: 6500.0, currency: "EUR", date: "Jun 26", time: "09:44", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-HMARTIN-0626", relatedIds: [182, 232] },
  { id: 182, merchant: "Rent Payment — Jun", type: "debit", amount: -3400.0, currency: "EUR", date: "Jun 26", time: "17:20", category: "Transfer", status: "success", method: "Bank transfer", reference: "RENT-0626-5541", creditId: 181 },
  { id: 183, merchant: "Google Workspace Annual", type: "debit", amount: -2100.0, currency: "GBP", date: "Jun 26", time: "13:00", category: "Transfer", status: "success", method: card.GBP, reference: "GSUITE-0626-2281" },
  { id: 232, merchant: "SaaS Services Payment", type: "debit", amount: -1900.0, currency: "EUR", date: "Jun 26", time: "08:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "SAAS-PAY-0626", creditId: 181 },
  // Jun 25
  // EUR credit 178 (standalone — large deposit)
  { id: 178, merchant: "Deposit — Marco Rossi", type: "credit", amount: 7100.0, currency: "EUR", date: "Jun 25", time: "09:05", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-MROSSI-0625" },
  { id: 179, merchant: "Visa Card Top-up", type: "debit", amount: -2500.0, currency: "GBP", date: "Jun 25", time: "08:40", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-VISA-0625" },
  { id: 180, merchant: "App Store Business", type: "debit", amount: -1800.0, currency: "USD", date: "Jun 25", time: "14:22", category: "Shopping", status: "success", method: card.USD, reference: "APPL-BIZ-0625" },
  { id: 233, merchant: "Pension Contribution", type: "debit", amount: -4000.0, currency: "GBP", date: "Jun 25", time: "13:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "PENSION-0625" },
  // Jun 23
  // EUR credit 174 → Tax payment (177)
  { id: 174, merchant: "Wire In — Tomas Novak", type: "credit", amount: 8500.0, currency: "EUR", date: "Jun 23", time: "08:55", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-TNOVAK-0623", relatedIds: [177] },
  { id: 175, merchant: "Equipment Purchase", type: "debit", amount: -5200.0, currency: "GBP", date: "Jun 23", time: "11:30", category: "Shopping", status: "success", method: card.GBP, reference: "EQUIP-0623-8830" },
  { id: 176, merchant: "Prepaid Wallet Top-up", type: "debit", amount: -3000.0, currency: "GBP", date: "Jun 23", time: "15:00", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-WALLET-0623" },
  { id: 177, merchant: "Tax Payment — Q2 2026", type: "debit", amount: -6200.0, currency: "EUR", date: "Jun 23", time: "09:10", category: "Transfer", status: "success", method: "Bank transfer", reference: "TAX-Q2-0623", creditId: 174 },
  // Jun 21
  // EUR credits 171+170 → Payroll run (173) + Office rent (234)
  { id: 171, merchant: "Freelance — Studio X", type: "credit", amount: 9500.0, currency: "EUR", date: "Jun 21", time: "08:00", category: "Income", status: "success", method: "Bank transfer", reference: "STUDIOX-INV-45", relatedIds: [173, 234] },
  { id: 170, merchant: "Deposit — Greta Hansen", type: "credit", amount: 4800.0, currency: "EUR", date: "Jun 21", time: "09:20", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-GHANSEN-0621" },
  { id: 172, merchant: "Hardware Purchase", type: "debit", amount: -3600.0, currency: "USD", date: "Jun 21", time: "16:45", category: "Shopping", status: "success", method: card.USD, reference: "HW-0621-5590" },
  { id: 173, merchant: "Payroll — Staff Jun", type: "debit", amount: -4100.0, currency: "EUR", date: "Jun 21", time: "11:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "PAYROLL-0621", creditId: 171 },
  { id: 234, merchant: "Office Rent — Jun", type: "debit", amount: -2900.0, currency: "EUR", date: "Jun 21", time: "19:10", category: "Transfer", status: "success", method: "Bank transfer", reference: "OFFRENT-0621-3391", creditId: 171 },
  // Jun 20
  // EUR credit 167 (standalone large transfer)
  { id: 167, merchant: "Wire In — Elena Popov", type: "credit", amount: 6800.0, currency: "EUR", date: "Jun 20", time: "09:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-EPOPOV-0620" },
  { id: 168, merchant: "Mastercard Top-up", type: "debit", amount: -2500.0, currency: "GBP", date: "Jun 20", time: "12:00", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-MC-0620" },
  { id: 169, merchant: "Council Tax Payment", type: "debit", amount: -1800.0, currency: "GBP", date: "Jun 20", time: "08:47", category: "Transfer", status: "success", method: "Bank transfer", reference: "CTAX-0620-1102" },
  { id: 235, merchant: "Rail Season Ticket Renewal", type: "debit", amount: -4200.0, currency: "GBP", date: "Jun 20", time: "16:20", category: "Transport", status: "success", method: card.GBP, reference: "RAIL-RENEW-0620" },
  // Jun 18
  // EUR credit 163 → Flight booking (164) + Exchange fee (166)
  { id: 163, merchant: "Deposit — Isabella Conti", type: "credit", amount: 5300.0, currency: "EUR", date: "Jun 18", time: "08:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-ICONTI-0618", relatedIds: [164, 166] },
  { id: 164, merchant: "Business Class Flight", type: "debit", amount: -3800.0, currency: "EUR", date: "Jun 18", time: "10:15", category: "Travel", status: "success", method: card.EUR, reference: "FLIGHT-0618-4420", creditId: 163 },
  { id: 165, merchant: "Microsoft 365 Annual", type: "debit", amount: -1200.0, currency: "GBP", date: "Jun 18", time: "13:00", category: "Transfer", status: "success", method: card.GBP, reference: "MSFT-365-0618" },
  { id: 166, merchant: "Currency Exchange Fee", type: "debit", amount: -1100.0, currency: "EUR", date: "Jun 18", time: "17:40", category: "Fees", status: "success", method: "Service charge", reference: "FX-FEE-0618", creditId: 163 },
  // Jun 16
  // EUR credit 159 (standalone large deposit)
  { id: 159, merchant: "Wire In — Jan Kowalczyk", type: "credit", amount: 7500.0, currency: "EUR", date: "Jun 16", time: "08:44", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-JKOWALCZYK-0616" },
  { id: 160, merchant: "To Lena Brandt", type: "debit", amount: -4500.0, currency: "GBP", date: "Jun 16", time: "14:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-LBRANDT-0616" },
  { id: 161, merchant: "Restaurant Group Payment", type: "debit", amount: -2800.0, currency: "USD", date: "Jun 16", time: "19:20", category: "Food", status: "success", method: card.USD, reference: "RESTGRP-0616-7720" },
  { id: 162, merchant: "International transfer fee", type: "debit", amount: -4.99, currency: "GBP", date: "Jun 16", time: "14:01", category: "Fees", status: "success", method: "Service charge", reference: "FEE-INTL-0616" },
  // Jun 15
  // EUR credit 155 → Office supplies (157)
  { id: 155, merchant: "Deposit — Sophie Dubois", type: "credit", amount: 6200.0, currency: "EUR", date: "Jun 15", time: "08:20", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-SDUBOIS-0615", relatedIds: [157] },
  // USD exchange credit 156 (standalone)
  { id: 156, merchant: "Currency Exchange", type: "credit", amount: 4500.0, currency: "USD", date: "Jun 15", time: "09:30", category: "Exchange", status: "success", method: "GBP → USD", reference: "FX-0615-6610", rate: "1 GBP = 1.27 USD" },
  { id: 157, merchant: "Office Fit-out Payment", type: "debit", amount: -5100.0, currency: "EUR", date: "Jun 15", time: "15:45", category: "Transfer", status: "success", method: "Bank transfer", reference: "OFFICE-FIT-0615", creditId: 155 },
  { id: 158, merchant: "Visa Debit Top-up", type: "debit", amount: -2000.0, currency: "GBP", date: "Jun 15", time: "13:00", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-VISA-0615" },
  // Jun 13
  // EUR credit 151 → Staff bonus (154)
  { id: 151, merchant: "Wire In — David Müller", type: "credit", amount: 9800.0, currency: "EUR", date: "Jun 13", time: "08:10", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-DMULLER-0613", relatedIds: [154] },
  { id: 152, merchant: "AWS Cloud Services", type: "debit", amount: -3700.0, currency: "USD", date: "Jun 13", time: "21:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "AWS-SVC-0613" },
  { id: 153, merchant: "Corporate Travel Booking", type: "debit", amount: -4100.0, currency: "GBP", date: "Jun 13", time: "07:40", category: "Travel", status: "success", method: card.GBP, reference: "CORP-TRVL-0613" },
  { id: 154, merchant: "Staff Bonus Payment", type: "debit", amount: -6500.0, currency: "EUR", date: "Jun 13", time: "18:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "BONUS-0613-9901", creditId: 151 },
  // Jun 12
  // EUR credits 1+3 → Investment fund (13)
  { id: 1, merchant: "Wire In — Olivia Schmidt", type: "credit", amount: 5800.0, currency: "EUR", date: "Jun 12", time: "08:05", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-OSCHMIDT-0612", relatedIds: [13] },
  { id: 3, merchant: "Deposit — Sofia Bauer", type: "credit", amount: 4200.0, currency: "EUR", date: "Jun 12", time: "08:45", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-SBAUER-0612" },
  // GBP credit 5 → Vendor payments (2,4,6,7)
  { id: 5, merchant: "From James Carter", type: "credit", amount: 7500.0, currency: "GBP", date: "Jun 12", time: "09:10", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-IN-JCARTER-0612", relatedIds: [7, 6, 2, 4] },
  { id: 2, merchant: "Adobe Creative Cloud", type: "debit", amount: -1800.0, currency: "GBP", date: "Jun 12", time: "13:00", category: "Transfer", status: "success", method: card.GBP, reference: "ADOBE-0612-1183", creditId: 5 },
  { id: 4, merchant: "Amazon Web Services", type: "debit", amount: -2400.0, currency: "GBP", date: "Jun 12", time: "14:30", category: "Transfer", status: "success", method: card.GBP, reference: "AWS-0612-4471", creditId: 5 },
  { id: 6, merchant: "Card maintenance fee", type: "debit", amount: -2.99, currency: "GBP", date: "Jun 12", time: "00:01", category: "Fees", status: "success", method: "Service charge", reference: "FEE-CARD-0612", creditId: 5 },
  { id: 7, merchant: "Prepaid Card Top-up", type: "debit", amount: -1900.0, currency: "GBP", date: "Jun 12", time: "08:35", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-PRE-0612", creditId: 5 },
  { id: 13, merchant: "Investment Fund Deposit", type: "debit", amount: -4600.0, currency: "EUR", date: "Jun 11", time: "18:45", category: "Transfer", status: "success", method: "Bank transfer", reference: "INVEST-FUND-0611", creditId: 1 },
  // Jun 11
  // GBP credit 8 → To James (10) + Wallet top-up (11)
  { id: 8, merchant: "Deposit — Liam O'Brien", type: "credit", amount: 3200.0, currency: "GBP", date: "Jun 11", time: "08:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-LOBRIEN-0611", relatedIds: [10, 11] },
  // EUR credit 12 → Investment (13)
  { id: 12, merchant: "Wire In — Mia Larsson", type: "credit", amount: 2800.0, currency: "EUR", date: "Jun 11", time: "09:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-MLARSSON-0611", relatedIds: [13] },
  { id: 9, merchant: "MacBook Pro Purchase", type: "debit", amount: -3800.0, currency: "USD", date: "Jun 11", time: "14:20", category: "Shopping", status: "success", method: card.USD, reference: "APPL-MBP-0611" },
  { id: 10, merchant: "To James Carter", type: "debit", amount: -2000.0, currency: "GBP", date: "Jun 11", time: "11:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-JCARTER-0611", creditId: 8 },
  { id: 11, merchant: "Visa Card Top-up", type: "debit", amount: -1500.0, currency: "GBP", date: "Jun 11", time: "16:30", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-VISA-0611", creditId: 8 },
  { id: 14, merchant: "Corporate Taxi Account", type: "debit", amount: -1200.0, currency: "USD", date: "Jun 11", time: "22:10", category: "Transport", status: "success", method: card.USD, reference: "TAXI-CORP-0611" },
  // Jun 10
  // GBP credit 15 → Supplier (18)
  { id: 15, merchant: "Salary — Northwind Ltd", type: "credit", amount: 7800.0, currency: "GBP", date: "Jun 10", time: "07:00", category: "Income", status: "success", method: "Bank transfer", reference: "NW-PAYROLL-0610", relatedIds: [18] },
  // EUR credit 16 → Marketing services (19)
  { id: 16, merchant: "Wire In — Hugo Martin", type: "credit", amount: 3500.0, currency: "EUR", date: "Jun 10", time: "09:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-HMARTIN-0610", relatedIds: [19] },
  { id: 17, merchant: "Software License Purchase", type: "debit", amount: -2900.0, currency: "USD", date: "Jun 10", time: "15:00", category: "Shopping", status: "success", method: card.USD, reference: "SWLIC-0610-9900" },
  { id: 18, merchant: "Supplier Invoice Payment", type: "debit", amount: -5200.0, currency: "GBP", date: "Jun 10", time: "20:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "SUPP-INV-0610", creditId: 15 },
  { id: 19, merchant: "Marketing Agency Services", type: "debit", amount: -2800.0, currency: "EUR", date: "Jun 10", time: "11:45", category: "Transfer", status: "success", method: "Bank transfer", reference: "MKT-SVC-0610", creditId: 16 },
  // Jun 9
  // EUR credits 20+21 → Supplier (24) + Card top-up (25)
  { id: 20, merchant: "Wire In — David Müller", type: "credit", amount: 8200.0, currency: "EUR", date: "Jun 9", time: "08:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-DMULLER-0609", relatedIds: [24, 25] },
  { id: 21, merchant: "Deposit — Elena Popov", type: "credit", amount: 5500.0, currency: "EUR", date: "Jun 9", time: "09:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-EPOPOV-0609" },
  { id: 22, merchant: "PlayStation Store Top-up", type: "debit", amount: -3000.0, currency: "USD", date: "Jun 9", time: "18:30", category: "Top-up", status: "success", method: card.USD, reference: "TOPUP-PSN-0609" },
  { id: 23, merchant: "Annual SaaS Subscription", type: "debit", amount: -4800.0, currency: "USD", date: "Jun 9", time: "13:00", category: "Transfer", status: "success", method: card.USD, reference: "SAAS-SUB-0609" },
  { id: 24, merchant: "Supplier Payment — QuadTech", type: "debit", amount: -6100.0, currency: "EUR", date: "Jun 9", time: "14:45", category: "Transfer", status: "success", method: "Bank transfer", reference: "SUPP-QUAD-0609", creditId: 20 },
  { id: 25, merchant: "Visa Business Card Top-up", type: "debit", amount: -2500.0, currency: "EUR", date: "Jun 9", time: "08:25", category: "Top-up", status: "success", method: card.EUR, reference: "TOPUP-VISA-0609", creditId: 20 },
  // Jun 8
  // EUR credit 26 — standalone large deposit
  { id: 26, merchant: "Deposit — Tomas Novak", type: "credit", amount: 4800.0, currency: "EUR", date: "Jun 8", time: "08:50", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-TNOVAK-0608" },
  { id: 27, merchant: "To Lena Brandt", type: "debit", amount: -3500.0, currency: "GBP", date: "Jun 8", time: "12:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-LBRANDT-0608" },
  { id: 28, merchant: "Enterprise Software License", type: "debit", amount: -5800.0, currency: "GBP", date: "Jun 8", time: "13:00", category: "Transfer", status: "success", method: card.GBP, reference: "ENT-SWLIC-0608" },
  { id: 29, merchant: "Debit Card Top-up", type: "debit", amount: -2200.0, currency: "GBP", date: "Jun 8", time: "09:10", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-DEBIT-0608" },
  { id: 30, merchant: "International transfer fee", type: "debit", amount: -4.99, currency: "GBP", date: "Jun 8", time: "12:01", category: "Fees", status: "success", method: "Service charge", reference: "FEE-INTL-0608" },
  // Jun 7
  // EUR exchange credit 31 + EUR credit 32 (standalones)
  { id: 31, merchant: "Currency Exchange", type: "credit", amount: 6500.0, currency: "EUR", date: "Jun 7", time: "09:00", category: "Exchange", status: "success", method: "GBP → EUR", reference: "FX-0607-5582", rate: "1 GBP = 1.17 EUR" },
  { id: 32, merchant: "Wire In — Felix Weber", type: "credit", amount: 3800.0, currency: "EUR", date: "Jun 7", time: "10:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-FWEBER-0607" },
  { id: 33, merchant: "To Noah Fischer", type: "debit", amount: -4200.0, currency: "USD", date: "Jun 7", time: "14:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-NFISCHER-0607" },
  { id: 34, merchant: "Office Equipment Purchase", type: "debit", amount: -3800.0, currency: "GBP", date: "Jun 7", time: "16:00", category: "Shopping", status: "success", method: card.GBP, reference: "OFFEQUIP-0607" },
  // Jun 6
  // EUR credit 35 (standalone)
  { id: 35, merchant: "Wire In — Klara Nowak", type: "credit", amount: 5200.0, currency: "EUR", date: "Jun 6", time: "08:40", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-KNOWAK-0606" },
  // USD credit 36 → Card top-ups (38+39)
  { id: 36, merchant: "Refund — Booking.com", type: "credit", amount: 7400.0, currency: "USD", date: "Jun 6", time: "11:00", category: "Travel", status: "success", method: card.USD, reference: "BKNG-RFND-0606", relatedIds: [38, 39] },
  // GBP credit 37 (standalone)
  { id: 37, merchant: "Deposit — Emma Wilson", type: "credit", amount: 4600.0, currency: "GBP", date: "Jun 6", time: "09:20", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-EWILSON-0606" },
  { id: 38, merchant: "Prepaid Wallet Top-up", type: "debit", amount: -5000.0, currency: "USD", date: "Jun 6", time: "20:00", category: "Top-up", status: "success", method: card.USD, reference: "TOPUP-WALLET-0606", creditId: 36 },
  { id: 39, merchant: "Hotel Group Payment", type: "debit", amount: -2100.0, currency: "USD", date: "Jun 6", time: "19:30", category: "Travel", status: "success", method: card.USD, reference: "HOTEL-0606-3391", creditId: 36 },
  // Jun 5
  // EUR credits 40+43 (standalones)
  { id: 40, merchant: "Wire In — Isabella Conti", type: "credit", amount: 6800.0, currency: "EUR", date: "Jun 5", time: "08:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-ICONTI-0605" },
  { id: 43, merchant: "Deposit — Sophie Dubois", type: "credit", amount: 4200.0, currency: "EUR", date: "Jun 5", time: "09:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-SDUBOIS-0605" },
  { id: 41, merchant: "Mastercard Top-up", type: "debit", amount: -3500.0, currency: "GBP", date: "Jun 5", time: "11:30", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-MC-0605" },
  { id: 42, merchant: "Annual Software Subscription", type: "debit", amount: -2800.0, currency: "USD", date: "Jun 5", time: "21:00", category: "Transfer", status: "success", method: card.USD, reference: "SWSUB-ANN-0605" },
  // Jun 4
  // USD credit 44 → Equipment (46) + FX fee (47)
  { id: 44, merchant: "Wire In — Daniel Cohen", type: "credit", amount: 9000.0, currency: "USD", date: "Jun 4", time: "08:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-DCOHEN-0604", relatedIds: [46, 47] },
  { id: 45, merchant: "Business Class Flight", type: "debit", amount: -4800.0, currency: "EUR", date: "Jun 4", time: "10:00", category: "Travel", status: "success", method: card.EUR, reference: "BIZFLIGHT-0604" },
  { id: 46, merchant: "Tech Equipment Order", type: "debit", amount: -6500.0, currency: "USD", date: "Jun 4", time: "16:20", category: "Shopping", status: "success", method: card.USD, reference: "TECHEQUIP-0604", creditId: 44 },
  { id: 47, merchant: "Currency conversion fee", type: "debit", amount: -1.2, currency: "USD", date: "Jun 4", time: "16:21", category: "Fees", status: "success", method: "Service charge", reference: "FEE-FX-0604", creditId: 44 },
  { id: 48, merchant: "Mortgage Payment — Jun", type: "debit", amount: -2200.0, currency: "GBP", date: "Jun 4", time: "18:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "MORT-0604-9912" },
  // Jun 3
  // EUR credits 49+52 → Transfer out (50)
  { id: 49, merchant: "Wire In — Jan Kowalczyk", type: "credit", amount: 7200.0, currency: "EUR", date: "Jun 3", time: "08:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-JKOWALCZYK-0603", relatedIds: [50] },
  { id: 52, merchant: "Deposit — Eva Lindqvist", type: "credit", amount: 4500.0, currency: "EUR", date: "Jun 3", time: "09:40", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-ELINDQVIST-0603" },
  { id: 50, merchant: "To Anna Kowalski", type: "debit", amount: -5800.0, currency: "EUR", date: "Jun 3", time: "13:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-AKOWALSKI-0603", creditId: 49 },
  { id: 51, merchant: "Visa Card Top-up", type: "debit", amount: -2500.0, currency: "GBP", date: "Jun 3", time: "20:00", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-VISA-0603" },
  // Jun 2
  // EUR credit 53 (standalone — large freelance)
  { id: 53, merchant: "Freelance — Studio X", type: "credit", amount: 8500.0, currency: "EUR", date: "Jun 2", time: "08:00", category: "Income", status: "success", method: "Bank transfer", reference: "STUDIOX-INV-44" },
  // USD exchange credit 54 → Amazon (55)
  { id: 54, merchant: "Currency Exchange", type: "credit", amount: 5200.0, currency: "USD", date: "Jun 2", time: "09:15", category: "Exchange", status: "success", method: "EUR → USD", reference: "FX-0602-2210", rate: "1 EUR = 1.08 USD", relatedIds: [55] },
  // GBP credit 56 → Card top-up (239)
  { id: 56, merchant: "Deposit — Sophie Dubois", type: "credit", amount: 3800.0, currency: "GBP", date: "Jun 2", time: "10:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-SDUBOIS-0602", relatedIds: [239] },
  { id: 55, merchant: "Amazon Business Purchase", type: "debit", amount: -4100.0, currency: "USD", date: "Jun 2", time: "21:30", category: "Shopping", status: "success", method: card.USD, reference: "AMZ-BIZ-0602", creditId: 54 },
  { id: 239, merchant: "Mastercard Business Top-up", type: "debit", amount: -3200.0, currency: "GBP", date: "Jun 2", time: "08:30", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-MC-BIZ-0602", creditId: 56 },
  // Jun 1
  // EUR credit 57 → Deposit (58)
  { id: 57, merchant: "Wire In — Pavel Horvath", type: "credit", amount: 6200.0, currency: "EUR", date: "Jun 1", time: "08:20", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-PHORVATH-0601", relatedIds: [58] },
  // GBP credit 59 → Rail season (60)
  { id: 59, merchant: "Deposit — Lena Brandt", type: "credit", amount: 4500.0, currency: "GBP", date: "Jun 1", time: "09:35", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-LBRANDT-0601", relatedIds: [60] },
  { id: 58, merchant: "Term Deposit — 3 Month", type: "debit", amount: -5000.0, currency: "EUR", date: "Jun 1", time: "14:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "TERM-DEP-0601", creditId: 57 },
  { id: 60, merchant: "Annual Rail Card", type: "debit", amount: -3800.0, currency: "GBP", date: "Jun 1", time: "09:00", category: "Transport", status: "success", method: card.GBP, reference: "RAIL-ANN-0601", creditId: 59 },
  // May 31
  // EUR credit 61 → Payments (63+64)
  { id: 61, merchant: "Wire In — Greta Hansen", type: "credit", amount: 7500.0, currency: "EUR", date: "May 31", time: "08:55", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-GHANSEN-0531", relatedIds: [63, 64] },
  // GBP cashback 62 (tiny credit, no linked debit)
  { id: 62, merchant: "Cashback reward", type: "credit", amount: 4.25, currency: "GBP", date: "May 31", time: "00:01", category: "Income", status: "success", method: "Rewards", reference: "CASHBACK-0531" },
  { id: 63, merchant: "Supplier Bulk Payment", type: "debit", amount: -4200.0, currency: "EUR", date: "May 31", time: "11:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "SUPP-BULK-0531", creditId: 61 },
  { id: 64, merchant: "To Lucas Bianchi", type: "debit", amount: -2800.0, currency: "EUR", date: "May 31", time: "15:20", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-LBIANCHI-0531", creditId: 61 },
  // May 30
  // EUR credit 65 → Deposit out (69)
  { id: 65, merchant: "Deposit — Mateo Garcia", type: "credit", amount: 6800.0, currency: "EUR", date: "May 30", time: "08:10", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-MGARCIA-0530", relatedIds: [69] },
  { id: 66, merchant: "Hotel Stay — NYC", type: "debit", amount: -4500.0, currency: "USD", date: "May 30", time: "12:00", category: "Travel", status: "success", method: card.USD, reference: "HOTEL-NYC-0530" },
  { id: 67, merchant: "Visa Prepaid Top-up", type: "debit", amount: -2800.0, currency: "GBP", date: "May 30", time: "16:00", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-VISA-PRE-0530" },
  { id: 68, merchant: "Monthly account fee", type: "debit", amount: -5.0, currency: "GBP", date: "May 30", time: "00:01", category: "Fees", status: "success", method: "Service charge", reference: "FEE-MONTH-0530" },
  { id: 69, merchant: "Property Deposit", type: "debit", amount: -5500.0, currency: "EUR", date: "May 30", time: "19:45", category: "Transfer", status: "success", method: "Bank transfer", reference: "PROP-DEP-0530", creditId: 65 },
  // May 28
  // GBP credit 70 → Equipment (73)
  { id: 70, merchant: "Wire In — Marco Rossi", type: "credit", amount: 5200.0, currency: "GBP", date: "May 28", time: "08:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-MROSSI-0528", relatedIds: [73] },
  { id: 71, merchant: "To David Müller", type: "debit", amount: -3800.0, currency: "EUR", date: "May 28", time: "11:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-DMULLER-0528" },
  { id: 72, merchant: "MacBook Purchase", type: "debit", amount: -2900.0, currency: "USD", date: "May 28", time: "14:30", category: "Shopping", status: "success", method: card.USD, reference: "APPL-MBP-0528" },
  { id: 73, merchant: "Professional Equipment", type: "debit", amount: -4100.0, currency: "GBP", date: "May 28", time: "17:15", category: "Shopping", status: "success", method: card.GBP, reference: "PROEQUIP-0528", creditId: 70 },
  // May 27
  // USD credit 74 (standalone)
  { id: 74, merchant: "Wire In — Noah Fischer", type: "credit", amount: 3500.0, currency: "USD", date: "May 27", time: "09:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-NFISCHER-0527" },
  { id: 75, merchant: "Furniture Purchase", type: "debit", amount: -4800.0, currency: "EUR", date: "May 27", time: "13:40", category: "Shopping", status: "success", method: card.EUR, reference: "FURN-0527-9914" },
  { id: 76, merchant: "To Sofia Bauer", type: "debit", amount: -2600.0, currency: "EUR", date: "May 27", time: "11:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-SBAUER-0527" },
  { id: 77, merchant: "Debit Card Top-up", type: "debit", amount: -1800.0, currency: "GBP", date: "May 27", time: "13:00", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-DEBIT-0527" },
  // May 26
  // EUR exchange credit 78 + EUR credit 79 (standalones)
  { id: 78, merchant: "Currency Exchange", type: "credit", amount: 7200.0, currency: "EUR", date: "May 26", time: "09:00", category: "Exchange", status: "success", method: "GBP → EUR", reference: "FX-0526-9912", rate: "1 GBP = 1.17 EUR" },
  { id: 79, merchant: "Wire In — Olivia Schmidt", type: "credit", amount: 5400.0, currency: "EUR", date: "May 26", time: "10:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-OSCHMIDT-0526" },
  { id: 80, merchant: "Mastercard Business Top-up", type: "debit", amount: -3500.0, currency: "GBP", date: "May 26", time: "12:30", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-MC-BIZ-0526" },
  { id: 81, merchant: "Annual Cloud Storage Plan", type: "debit", amount: -2100.0, currency: "GBP", date: "May 26", time: "13:00", category: "Transfer", status: "success", method: card.GBP, reference: "CLOUD-ANN-0526" },
  // May 24
  // EUR credit 82 (standalone)
  { id: 82, merchant: "Deposit — Klara Nowak", type: "credit", amount: 4500.0, currency: "EUR", date: "May 24", time: "08:45", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-KNOWAK-0524" },
  { id: 83, merchant: "To James Carter", type: "debit", amount: -3200.0, currency: "GBP", date: "May 24", time: "11:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-JCARTER-0524" },
  { id: 84, merchant: "Server Infrastructure", type: "debit", amount: -5600.0, currency: "GBP", date: "May 24", time: "15:30", category: "Shopping", status: "success", method: card.GBP, reference: "SERVER-0524-4419" },
  { id: 85, merchant: "Corporate Travel Pass", type: "debit", amount: -4100.0, currency: "GBP", date: "May 24", time: "07:50", category: "Transport", status: "success", method: card.GBP, reference: "CORP-TRVL-0524" },
  // May 22
  // USD credit 86 → AWS (87)
  { id: 86, merchant: "Wire In — Daniel Cohen", type: "credit", amount: 8500.0, currency: "USD", date: "May 22", time: "08:20", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-DCOHEN-0522", relatedIds: [87] },
  // EUR credit 89 → Services (88)
  { id: 89, merchant: "Deposit — Felix Weber", type: "credit", amount: 3800.0, currency: "EUR", date: "May 22", time: "09:05", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-FWEBER-0522", relatedIds: [88] },
  { id: 87, merchant: "AWS Reserved Instances", type: "debit", amount: -6200.0, currency: "USD", date: "May 22", time: "20:00", category: "Transfer", status: "success", method: card.USD, reference: "AWS-RES-0522", creditId: 86 },
  { id: 88, merchant: "Consulting Services Payment", type: "debit", amount: -3100.0, currency: "EUR", date: "May 22", time: "14:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "CONSULT-SVC-0522", creditId: 89 },
  // May 20
  // GBP credit 90 (standalone salary)
  { id: 90, merchant: "Salary — Northwind Ltd", type: "credit", amount: 7800.0, currency: "GBP", date: "May 20", time: "07:00", category: "Income", status: "success", method: "Bank transfer", reference: "NW-PAYROLL-0520" },
  // EUR credit 91 → Services payment (93)
  { id: 91, merchant: "Wire In — Elena Popov", type: "credit", amount: 5600.0, currency: "EUR", date: "May 20", time: "09:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-EPOPOV-0520", relatedIds: [93] },
  { id: 92, merchant: "To Noah Fischer", type: "debit", amount: -3400.0, currency: "USD", date: "May 20", time: "11:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-NFISCHER-0520" },
  { id: 93, merchant: "Legal Services Payment", type: "debit", amount: -4500.0, currency: "EUR", date: "May 20", time: "16:45", category: "Transfer", status: "success", method: "Bank transfer", reference: "LEGAL-SVC-0520", creditId: 91 },
  // May 18
  // EUR credit 94 → Deposit (95)
  { id: 94, merchant: "Deposit — Mia Larsson", type: "credit", amount: 4800.0, currency: "EUR", date: "May 18", time: "08:40", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-MLARSSON-0518", relatedIds: [95] },
  { id: 95, merchant: "Property Tax Payment", type: "debit", amount: -3900.0, currency: "EUR", date: "May 18", time: "13:20", category: "Transfer", status: "success", method: "Bank transfer", reference: "PROP-TAX-0518", creditId: 94 },
  { id: 96, merchant: "Cloud Services Bill", type: "debit", amount: -2700.0, currency: "USD", date: "May 18", time: "18:00", category: "Transfer", status: "success", method: card.USD, reference: "CLOUD-BILL-0518" },
  { id: 97, merchant: "Mastercard Top-up", type: "debit", amount: -1800.0, currency: "GBP", date: "May 18", time: "11:00", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-MC-0518" },
  // May 15
  // EUR credit 98 → Conference (100)
  { id: 98, merchant: "Wire In — Sofia Bauer", type: "credit", amount: 6500.0, currency: "EUR", date: "May 15", time: "08:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-SBAUER-0515", relatedIds: [100] },
  { id: 99, merchant: "To Lena Brandt", type: "debit", amount: -3200.0, currency: "GBP", date: "May 15", time: "12:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-LBRANDT-0515" },
  { id: 100, merchant: "Conference & Events", type: "debit", amount: -5100.0, currency: "EUR", date: "May 15", time: "09:45", category: "Travel", status: "success", method: card.EUR, reference: "CONF-EVT-0515", creditId: 98 },
  { id: 101, merchant: "Visa Card Top-up", type: "debit", amount: -2400.0, currency: "USD", date: "May 15", time: "15:10", category: "Top-up", status: "success", method: card.USD, reference: "TOPUP-VISA-0515" },
  // May 13
  // EUR credits 102+105 → Supplier (104)
  { id: 102, merchant: "Wire In — Tomas Novak", type: "credit", amount: 7200.0, currency: "EUR", date: "May 13", time: "08:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-TNOVAK-0513", relatedIds: [104] },
  // USD exchange credit 103 (standalone)
  { id: 103, merchant: "Currency Exchange", type: "credit", amount: 5800.0, currency: "USD", date: "May 13", time: "09:00", category: "Exchange", status: "success", method: "GBP → USD", reference: "FX-0513-7740", rate: "1 GBP = 1.27 USD" },
  { id: 105, merchant: "Deposit — Mia Larsson", type: "credit", amount: 3500.0, currency: "EUR", date: "May 13", time: "10:20", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-MLARSSON-0513" },
  { id: 104, merchant: "Supplier Payment — DevOps", type: "debit", amount: -5800.0, currency: "EUR", date: "May 13", time: "14:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "SUPP-DEVOPS-0513", creditId: 102 },
  { id: 240, merchant: "Annual Travel Pass", type: "debit", amount: -4200.0, currency: "GBP", date: "May 13", time: "07:35", category: "Transport", status: "success", method: card.GBP, reference: "TRVL-PASS-0513" },
  // May 10
  // EUR credit 106 → Flight (107) + Card top-up (109)
  { id: 106, merchant: "Deposit — Isabella Conti", type: "credit", amount: 8200.0, currency: "EUR", date: "May 10", time: "08:50", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-ICONTI-0510", relatedIds: [107, 109] },
  { id: 107, merchant: "Business Flight — Frankfurt", type: "debit", amount: -5400.0, currency: "EUR", date: "May 10", time: "11:00", category: "Travel", status: "success", method: card.EUR, reference: "FLIGHT-FRA-0510", creditId: 106 },
  { id: 108, merchant: "Card replacement fee", type: "debit", amount: -7.5, currency: "GBP", date: "May 10", time: "00:01", category: "Fees", status: "success", method: "Service charge", reference: "FEE-REPL-0510" },
  { id: 109, merchant: "Prepaid Visa Top-up", type: "debit", amount: -2500.0, currency: "EUR", date: "May 10", time: "17:30", category: "Top-up", status: "success", method: card.EUR, reference: "TOPUP-VISA-PRE-0510", creditId: 106 },
  // May 8
  // EUR credit 110 → Vendor (113)
  { id: 110, merchant: "Wire In — Jan Kowalczyk", type: "credit", amount: 6800.0, currency: "EUR", date: "May 8", time: "08:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-JKOWALCZYK-0508", relatedIds: [113] },
  { id: 111, merchant: "Azure Cloud Services", type: "debit", amount: -4200.0, currency: "USD", date: "May 8", time: "21:00", category: "Transfer", status: "success", method: card.USD, reference: "AZURE-SVC-0508" },
  { id: 112, merchant: "Equipment Lease Payment", type: "debit", amount: -3500.0, currency: "GBP", date: "May 8", time: "15:20", category: "Transfer", status: "success", method: card.GBP, reference: "EQUIPLEASE-0508" },
  { id: 113, merchant: "Vendor Invoice — Axis Ltd", type: "debit", amount: -5600.0, currency: "EUR", date: "May 8", time: "11:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "VENDOR-AXIS-0508", creditId: 110 },
  // May 6
  // EUR credit 114 → Tech services (115)
  { id: 114, merchant: "Deposit — Eva Lindqvist", type: "credit", amount: 5500.0, currency: "EUR", date: "May 6", time: "09:10", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-ELINDQVIST-0506", relatedIds: [115] },
  { id: 115, merchant: "IT Infrastructure Payment", type: "debit", amount: -4600.0, currency: "EUR", date: "May 6", time: "12:45", category: "Transfer", status: "success", method: "Bank transfer", reference: "IT-INFRA-0506", creditId: 114 },
  { id: 116, merchant: "To Noah Fischer", type: "debit", amount: -3100.0, currency: "USD", date: "May 6", time: "16:00", category: "Transfer", status: "success", method: "Bank transfer", reference: "P2P-OUT-NFISCHER-0506" },
  { id: 117, merchant: "Visa Business Top-up", type: "debit", amount: -2800.0, currency: "GBP", date: "May 6", time: "19:30", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-VISA-BIZ-0506" },
  // May 4
  // EUR credit 118 (standalone large deposit)
  { id: 118, merchant: "Wire In — Pavel Horvath", type: "credit", amount: 7400.0, currency: "EUR", date: "May 4", time: "08:25", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-PHORVATH-0504" },
  { id: 119, merchant: "Mastercard Top-up", type: "debit", amount: -3600.0, currency: "GBP", date: "May 4", time: "12:00", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-MC-0504" },
  { id: 120, merchant: "Annual SaaS Payment", type: "debit", amount: -5200.0, currency: "USD", date: "May 4", time: "22:00", category: "Transfer", status: "success", method: card.USD, reference: "SAAS-ANN-0504" },
  // May 3
  // EUR credit 121 (standalone)
  { id: 121, merchant: "Wire In — David Müller", type: "credit", amount: 6200.0, currency: "EUR", date: "May 3", time: "08:35", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-DMULLER-0503" },
  { id: 122, merchant: "Fleet Fuel Card Top-up", type: "debit", amount: -3800.0, currency: "GBP", date: "May 3", time: "08:10", category: "Top-up", status: "success", method: card.GBP, reference: "TOPUP-FUEL-0503" },
  { id: 123, merchant: "Catering Services", type: "debit", amount: -2200.0, currency: "GBP", date: "May 3", time: "20:30", category: "Food", status: "success", method: card.GBP, reference: "CATERING-0503" },
  // May 2
  // EUR credit 124 (standalone)
  { id: 124, merchant: "Deposit — Greta Hansen", type: "credit", amount: 4900.0, currency: "EUR", date: "May 2", time: "08:45", category: "Transfer", status: "success", method: "Bank transfer", reference: "DEP-IN-GHANSEN-0502" },
  // GBP dividend 125 (standalone)
  { id: 125, merchant: "Dividend — Vanguard", type: "credit", amount: 1850.0, currency: "GBP", date: "May 2", time: "07:00", category: "Income", status: "success", method: "Bank transfer", reference: "DIV-VAN-0502" },
  { id: 126, merchant: "MacBook & Accessories", type: "debit", amount: -4200.0, currency: "USD", date: "May 2", time: "14:00", category: "Shopping", status: "success", method: card.USD, reference: "APPL-MBP-ACC-0502" },
  // May 1
  // USD exchange credit 127 (standalone)
  { id: 127, merchant: "Currency Exchange", type: "credit", amount: 6800.0, currency: "USD", date: "May 1", time: "09:00", category: "Exchange", status: "success", method: "GBP → USD", reference: "FX-0501-7731", rate: "1 GBP = 1.27 USD" },
  // EUR credit 128 (standalone)
  { id: 128, merchant: "Wire In — Mateo Garcia", type: "credit", amount: 5500.0, currency: "EUR", date: "May 1", time: "10:30", category: "Transfer", status: "success", method: "Bank transfer", reference: "WIRE-IN-MGARCIA-0501" },
  { id: 129, merchant: "Mortgage Payment — May", type: "debit", amount: -2200.0, currency: "GBP", date: "May 1", time: "18:15", category: "Transfer", status: "success", method: "Bank transfer", reference: "MORT-0501-2200" },
  { id: 130, merchant: "ATM withdrawal fee", type: "debit", amount: -2.75, currency: "GBP", date: "May 1", time: "11:00", category: "Fees", status: "success", method: "Service charge", reference: "FEE-ATM-0501" },
];

/** Returns only the transactions that belong to a specific wallet currency. */
export function walletTransactions(currency: CurrencyCode): Transaction[] {
  return transactions.filter((tx) => tx.currency === currency);
}

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
