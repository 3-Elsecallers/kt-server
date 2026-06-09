interface ITransactionInput {
  tabId: string;
  idempotencyKey: string;
  type: string;
  amountPesewas: number;
  gratuityPesewas?: number;
}

const validTransactionTypes = [
  "PRE_AUTH",
  "CAPTURE",
  "REFUND",
  "VOID",
  "TIP_ADJUSTMENT",
];

const createTransactionValidation = (details: ITransactionInput) => {
  const { tabId, idempotencyKey, type, amountPesewas, gratuityPesewas } =
    details;

  const errors: Record<string, string> = {};

  if (!tabId || tabId.trim() === "") {
    errors.tabId = "Tab ID is required";
  }

  if (!idempotencyKey || idempotencyKey.trim() === "") {
    errors.idempotencyKey = "Idempotency key is required";
  }

  if (!type || !validTransactionTypes.includes(type)) {
    errors.type = "Invalid transaction type";
  }

  if (amountPesewas === undefined || amountPesewas <= 0) {
    errors.amountPesewas = "Amount must be greater than 0";
  }

  if (gratuityPesewas !== undefined && gratuityPesewas < 0) {
    errors.gratuityPesewas = "Gratuity cannot be negative";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { createTransactionValidation };
