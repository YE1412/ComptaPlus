declare const useUserStore: import("pinia").StoreDefinition<
  "user",
  {
    connected: boolean;
    user: {};
  },
  {
    getConnected(state: any): any;
    getUser(state: any): any;
  },
  {
    loginUser(login: string, password: string): Promise<unknown>;
  },
  {
    retrieveUser(id: number): Promise<unknown>;
  },
  {
    resetUser();
  }
>;
export { useUserStore };
