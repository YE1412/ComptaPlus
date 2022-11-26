declare const useInvoiceStore: import("pinia").StoreDefinition<
  "invoice",
  {
    invoices: never[];
    languages: never[];
    devises: never[];
    sellers: never[];
    buyers: never[];
    payments: never[];
    orders: never[];
  },
  {
    getInvoices(state: any): any;
    getLanguages(state: any): any;
    getDevises(state: any): any;
    getSellers(state: any): any;
    getBuyers(state: any): any;
    getPayments(state: any): any;
    getOrders(state: any): any;
  },
  {
    getAllInvoices(): Promise<unknown>;
    getMoreInvoices(ids: number[]): Promise<unknown>;
    getAllLanguages(): Promise<unknown>;
    getAllDevises(): Promise<unknown>;
    getAllOrders(): Promise<unknown>;
    getAllSellers(): Promise<unknown>;
    getAllBuyers(): Promise<unknown>;
    getAllPayments(): Promise<unknown>;
  }
>;
export { useInvoiceStore };
