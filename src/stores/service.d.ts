declare const useServiceStore: import("pinia").StoreDefinition<
  "service",
  {
    services: never[];
  },
  {
    getServices(state: any): any;
  },
  {
    getAllServices(): Promise<unknown>;
  }
>;
export { useServiceStore };
