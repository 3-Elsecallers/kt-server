interface IVenueInput {
  name: string;
  address: string;
  city: string;
  country: string;
}

const createVenueValidation = (details: IVenueInput) => {
  const { name, address, city, country } = details;
  const errors: Record<string, string> = {};

  if (!name || name.trim() === "") {
    errors.name = "Venue name is required";
  }

  if (!address || address.trim() === "") {
    errors.address = "Address is required";
  }

  if (!city || city.trim() === "") {
    errors.city = "City is required";
  }

  if (!country || country.trim() === "") {
    errors.country = "Country is required";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

const updateVenueValidation = (details: Partial<IVenueInput>) => {
  const { name, address, city, country } = details;
  const errors: Record<string, string> = {};

  if (name && name.trim() === "") {
    errors.name = "Venue name is required";
  }

  if (address && address.trim() === "") {
    errors.address = "Address is required";
  }

  if (city && city.trim() === "") {
    errors.city = "City is required";
  }

  if (country && country.trim() === "") {
    errors.country = "Country is required";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { createVenueValidation, updateVenueValidation };
