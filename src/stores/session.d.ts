declare const useSessionStore: import("pinia").StoreDefinition<
  "session",
  {
    sessionId: import("@vueuse/shared").RemovableRef<string>;
  },
  {
    getSessionId(state: any): any;
  },
  {
    getSession(): Promise<unknown>;
    validateSession(): Promise<unknown>;
    deleteSession(): Promise<any>;
  }
>;
export { useSessionStore };
