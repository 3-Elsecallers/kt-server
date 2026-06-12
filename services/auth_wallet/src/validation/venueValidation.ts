interface IVenueInput {
  name: string;
  address: string;
  latLng: string;
  city: string;
  country: string;
  authorizationAmount: number;
}

const createVenueValidation = (details: IVenueInput) => {
  const { name, address, latLng, city, country, authorizationAmount } = details;
  const errors: Record<string, string> = {};

  if (!name || name.trim() === "") {
    errors.name = "Venue name is required";
  }

  if (!address || address.trim() === "") {
    errors.address = "Address is required";
  }

  if (!latLng || latLng.trim() === "") {
    errors.latLng = "Lat Lng is required";
  }

  if (!city || city.trim() === "") {
    errors.city = "City is required";
  }

  if (!country || country.trim() === "") {
    errors.country = "Country is required";
  }

  if (!authorizationAmount || authorizationAmount < 1) {
    errors.authorizationAmount = "Authorization amount is required";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

const updateVenueValidation = (details: Partial<IVenueInput>) => {
  const { name, address, latLng, city, country, authorizationAmount } = details;
  const errors: Record<string, string> = {};

  if (name && name.trim() === "") {
    errors.name = "Venue name is required";
  }

  if (address && address.trim() === "") {
    errors.address = "Address is required";
  }

  if (latLng && latLng.trim() === "") {
    errors.latLng = "Lat Lng is required";
  }

  if (city && city.trim() === "") {
    errors.city = "City is required";
  }

  if (country && country.trim() === "") {
    errors.country = "Country is required";
  }

  if (authorizationAmount !== undefined && authorizationAmount <= 0) {
    errors.authorizationAmount = "Authorization amount must be greater than 0";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { createVenueValidation, updateVenueValidation };
