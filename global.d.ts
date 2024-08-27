declare global {
  interface Window {
    handleSectionClick: (event: Event, section: any) => void;
    toggleItemPurchaseStatus: (event: Event, id: number) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    populateItems: () => Promise<void>;
    populateLists: () => Promise<void>;
  }
}

export {};
