interface ITabItemInput {
  tabId: string;
  posItemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
}

const createTabItemValidation = (details: ITabItemInput) => {
  const { tabId, posItemId, itemName, quantity, unitPrice } = details;

  const errors: Record<string, string> = {};

  if (!tabId || tabId.trim() === "") {
    errors.tabId = "Tab ID is required";
  }

  if (!posItemId || posItemId.trim() === "") {
    errors.posItemId = "POS item ID is required";
  }

  if (!itemName || itemName.trim() === "") {
    errors.itemName = "Item name is required";
  }

  if (!quantity || quantity < 1) {
    errors.quantity = "Quantity must be greater than 0";
  }

  if (unitPrice === undefined || unitPrice <= 0) {
    errors.unitPrice = "Unit price must be greater than 0";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

const updateTabItemValidation = (details: Partial<ITabItemInput>) => {
  const { tabId, posItemId, itemName, quantity, unitPrice } = details;

  const errors: Record<string, string> = {};

  if (tabId !== undefined && tabId.trim() === "") {
    errors.tabId = "Tab ID is required";
  }

  if (posItemId !== undefined && posItemId.trim() === "") {
    errors.posItemId = "POS item ID is required";
  }

  if (itemName !== undefined && itemName.trim() === "") {
    errors.itemName = "Item name is required";
  }

  if (quantity !== undefined && quantity < 1) {
    errors.quantity = "Quantity must be greater than 0";
  }

  if (unitPrice !== undefined && unitPrice <= 0) {
    errors.unitPrice = "Unit price must be greater than 0";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { createTabItemValidation, updateTabItemValidation };
