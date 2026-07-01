interface ITabInput {
  userId: string;
  venueId: string;
  paymentMethodId: string;
  posTabReference?: string;
  status?: string;
  preAuthAmount: number;
}

const validStatuses = [
  "OPEN",
  "ACTIVE",
  "PENDING_SETTLEMENT",
  "CLOSED",
  "ABANDONED",
];

const createTabValidation = (details: ITabInput) => {
  const { userId, venueId, paymentMethodId, status, preAuthAmount } =
    details;

  const errors: Record<string, string> = {};

  if (!userId || userId.trim() === "") {
    errors.userId = "User ID is required";
  }

  if (!venueId || venueId.trim() === "") {
    errors.venueId = "Venue ID is required";
  }

  if (!paymentMethodId || paymentMethodId.trim() === "") {
    errors.paymentMethodId = "Payment method ID is required";
  }

  if (preAuthAmount === undefined || preAuthAmount === null) {
    errors.preAuthAmount = "Pre-auth amount is required";
  } else if (preAuthAmount <= 0) {
    errors.preAuthAmount = "Pre-auth amount must be greater than 0";
  }

  if (status && !validStatuses.includes(status)) {
    errors.status = "Invalid tab status";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

const updateTabValidation = (details: Partial<ITabInput>) => {
  const { userId, venueId, paymentMethodId, status, preAuthAmount } =
    details;

  const errors: Record<string, string> = {};

  if (userId !== undefined && userId.trim() === "") {
    errors.userId = "User ID is required";
  }

  if (venueId !== undefined && venueId.trim() === "") {
    errors.venueId = "Venue ID is required";
  }

  if (paymentMethodId !== undefined && paymentMethodId.trim() === "") {
    errors.paymentMethodId = "Payment method ID is required";
  }

  if (preAuthAmount !== undefined && preAuthAmount <= 0) {
    errors.preAuthAmount = "Pre-auth amount must be greater than 0";
  }

  if (status && !validStatuses.includes(status)) {
    errors.status = "Invalid tab status";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { createTabValidation, updateTabValidation };
