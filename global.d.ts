declare global {
  interface Window {
    handleSectionClick: (event: Event, section: any) => void;
    toggleItemPurchaseStatus: (event: Event, id: string) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    populateItems: () => Promise<void>;
    populateLists: () => Promise<void>;
  }
}

export {};
