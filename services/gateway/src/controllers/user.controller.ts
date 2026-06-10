import { Request, Response } from "express";
import "dotenv/config";

const { AUTH_WALLET_BASE_URL } = process.env;

const createUser = async (req: Request, res: Response) => {
  try {
    const payload = req.body ?? {};

    const response = await fetch(`${AUTH_WALLET_BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
      }),
    });
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${AUTH_WALLET_BASE_URL}/api/users`);

    if (response.status !== 200) {
      return res.sendStatus(response.status);
    }

    const jsonResponse = await response.json();

    return res.status(response.status).send(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const response = await fetch(`${AUTH_WALLET_BASE_URL}/api/users/${userId}`);
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const payload = req.body;

    const response = await fetch(
      `${AUTH_WALLET_BASE_URL}/api/categories/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload }),
      },
    );
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const response = await fetch(
      `${AUTH_WALLET_BASE_URL}/api/categories/${userId}`,
      {
        method: "DELETE",
      },
    );
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
