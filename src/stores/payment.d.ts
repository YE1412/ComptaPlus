declare const usePaymentStore: import("pinia").StoreDefinition<
  "payment",
  {
    payments: never[];
    types: never[];
    invoices: never[];
  },
  {
    getPayments(state: any): any;
    getTypes(state: any): any;
    getInvoices(state: any): any;
  },
  {
    getAllPayments(): Promise<unknown>;
    getAllPaymentTypes(): Promise<unknown>;
    getAllInvoices(): Promise<unknown>;
  }
>;
export { usePaymentStore };
