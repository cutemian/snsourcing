export interface Transaction {
  id: string
  customer_name: string
  phone_number: string
  item_description: string
  quantity: number
  rate: number
  total_bill: number
  amount_paid: number
  remaining_balance: number
  created_at: string
}

export type TransactionFormData = Omit<Transaction, 'id' | 'created_at' | 'total_bill' | 'remaining_balance'>
