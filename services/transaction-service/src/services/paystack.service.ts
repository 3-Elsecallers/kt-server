import axios from 'axios';

const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const initializeTransaction = async (
  email: string,
  amount: number,
  reference: string
) => {
  const response = await paystack.post(
    "/transaction/initialize",
    {
      email,
      amount,
      reference,
      callback_url:
        `${process.env.FRONTEND_URL}/payment-success`,
    }
  );

  return response.data;
};

export const verifyTransaction = async (
  reference: string
) => {
  const response = await paystack.get(
    `/transaction/verify/${reference}`
  );

  return response.data;
};

// export default paystack;