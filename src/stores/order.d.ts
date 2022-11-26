declare const useOrderStore: import("pinia").StoreDefinition<
  "order",
  {
    orders: never[];
  },
  {
    getActors(state: any): any;
    getTypes(state: any): any;
  },
  {
    getAllOrders(): Promise<unknown>;
  }
>;
export { useOrderStore };
