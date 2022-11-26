declare const useActorStore: import("pinia").StoreDefinition<
  "actor",
  {
    actors: never[];
    types: never[];
  },
  {
    getActors(state: any): any;
    getTypes(state: any): any;
  },
  {
    getAllActors(): Promise<unknown>;
    getAllTypes(): Promise<unknown>;
  }
>;
export { useActorStore };
