interface IUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const createUserValidation = (details: IUserInput) => {
  const { firstName, lastName, email, phoneNumber } = details;
  const errors: Record<string, string> = {};

  if (!firstName || firstName.trim() === "") {
    errors.firstName = "First name is required";
  }

  if (!lastName || lastName.trim() === "") {
    errors.lastName = "Last name is required";
  }

  if (!email || email.trim() === "") {
    errors.email = "Email is required";
  } else {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(emailRegex)) {
      errors.email = "Email must be a valid email address";
    }
  }

  if (!phoneNumber || phoneNumber.trim() === "") {
    errors.phoneNumber = "Phone number is required";
  } else {
    if (phoneNumber.length < 10) {
      errors.phoneNumber = "Phone number should be a minimum of 10 digits";
    }
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

const updateUserValidation = (details: Partial<IUserInput>) => {
  const { firstName, lastName, email, phoneNumber } = details;
  const errors: Record<string, string> = {};

  if (firstName && firstName.trim() === "") {
    errors.firstName = "First name is required";
  }

  if (!lastName || lastName.trim() === "") {
    errors.lastName = "Last name is required";
  }

  if (email && email.trim() === "") {
    errors.email = "Email is required";
  } else {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && email.match(emailRegex)) {
      errors.email = "Email must be a valid email address";
    }
  }

  if (phoneNumber && phoneNumber.trim() === "") {
    errors.phoneNumber = "Phone number is required";
  } else {
    if (phoneNumber && phoneNumber.length < 10) {
      errors.phoneNumber = "Phone number should be a minimum of 10 digits";
    }
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { createUserValidation, updateUserValidation };
