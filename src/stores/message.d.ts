declare const useMessageStore: import("pinia").StoreDefinition<
  "message",
  {
    messages: import("@vueuse/shared").RemovableRef<string>;
    messagesVisibility: import("@vueuse/shared").RemovableRef<string>;
  },
  {
    getMessages(state: any): any;
    getMessagesVisibility(state: any): any;
  },
  {
    deleteMessages(): void;
  }
>;
export { useMessageStore };
