export interface Product {
  id: number;
  name: string;
  category: string;
  sku: string;
  barcode?: string;
  current_stock: number;
  min_stock: number;
  price: number;
  expiry_date: string;
  created_at: string;
}

export interface Sale {
  id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  sale_date: string;
  total_price: number;
  payment_method?: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix';
  cash_register_id?: string;
}

export interface CashRegister {
  id: string;
  opened_at: string;
  closed_at: string | null;
  initial_balance: number;
  final_balance: number | null;
  status: 'open' | 'closed';
}

export interface PurchaseOrder {
  id: number;
  product_id: number;
  quantity: number;
  status: 'pending' | 'completed';
  order_date: string;
}

export interface AIInsight {
  productId: number;
  productName: string;
  predictedDemand: number;
  suggestedRestock: number;
  reason: string;
}

export interface XMLProduct {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  matchedProductId?: number;
}
