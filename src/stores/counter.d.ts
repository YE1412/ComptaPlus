declare const useCounterStore: import("pinia").StoreDefinition<
  "counter",
  {
    count: number;
    languages: import("@vueuse/shared").RemovableRef<string>;
    langDisplayedIndex: import("@vueuse/shared").RemovableRef<string>;
    prices: never[];
  },
  {
    getCount(state: any): any;
    getLanguages(state: any): any;
    getLangDisplayedIndex(state: any): any;
    getPrices(state: any): any;
  },
  {
    getAllPrices(): Promise<unknown>;
  }
>;
export { useCounterStore };
