declare global {
  interface Window {
    filterBySection: (section: any) => void;
    toggleItemPurchaseStatus: (event: Event, id: number) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    populateItems: () => Promise<void>;
  }
}

export {};
