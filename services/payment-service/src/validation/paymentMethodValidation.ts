interface IPaymentMethodInput {
  userId: string;
  gatewayCustomerToken: string;
  gatewayPaymentToken: string;
  providerType: string;
  maskedIdentifier: string;
}

const createPaymentMethodValidation = (details: IPaymentMethodInput) => {
  const {
    userId,
    gatewayCustomerToken,
    gatewayPaymentToken,
    providerType,
    maskedIdentifier,
  } = details;

  const errors: Record<string, string> = {};

  if (!userId || userId.trim() === "") {
    errors.userId = "User ID is required";
  }

  if (!gatewayCustomerToken || gatewayCustomerToken.trim() === "") {
    errors.gatewayCustomerToken = "Gateway customer token is required";
  }

  if (!gatewayPaymentToken || gatewayPaymentToken.trim() === "") {
    errors.gatewayPaymentToken = "Gateway payment token is required";
  }

  if (!providerType || providerType.trim() === "") {
    errors.providerType = "Provider type is required";
  }

  if (!maskedIdentifier || maskedIdentifier.trim() === "") {
    errors.maskedIdentifier = "Masked identifier is required";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { createPaymentMethodValidation };
