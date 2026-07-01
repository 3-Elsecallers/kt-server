import "dotenv/config";

const { VAT_RATE } = process.env;

interface TabItem {
  id: string;
  tabId: string;
  posItemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  orderedAt: string;
}

interface TabData {
  id: string;
  userId: string;
  venueId: string;
  paymentMethodId: string;
  posTabReference: string | null;
  status: string;
  preAuthAmount: number;
  runningTotal: number;
  openedAt: string;
  lastActivityAt: string;
  closedAt: string | null;
  transactions: any[];
  tabItems: TabItem[];
}

export const calculateAmount = (tab: TabData) => {
  const subtotal = Number(tab.runningTotal);
  const vatRate = Number(VAT_RATE) ?? 0.15; // 15% VAT rule
  const vatAmount = subtotal * vatRate;
  const totalDue = subtotal + vatAmount;

  console.log({ subtotal, vatAmount, totalDue })

  return { vatAmount, totalDue };
}