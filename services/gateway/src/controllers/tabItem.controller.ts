import { Request, Response } from "express";
import "dotenv/config";

const { TAB_MANAGEMENT_BASE_URL } = process.env;

const createTabItem = async (req: Request, res: Response) => {
  try {
    const payload = req.body ?? {};

    const response = await fetch(`${TAB_MANAGEMENT_BASE_URL}/api/tabItems`, {
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

const getAllTabItems = async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${TAB_MANAGEMENT_BASE_URL}/api/tabItems`);

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

const getTabItemById = async (req: Request, res: Response) => {
  try {
    const { tabItemId } = req.params;

    const response = await fetch(`${TAB_MANAGEMENT_BASE_URL}/api/tabItems/${tabItemId}`);
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getTabItemsByTabId = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const response = await fetch(`${TAB_MANAGEMENT_BASE_URL}/api/tabItems/${tabId}/items`);
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const updateTabItem = async (req: Request, res: Response) => {
  try {
    const { tabItemId } = req.params;
    const payload = req.body;

    const response = await fetch(
      `${TAB_MANAGEMENT_BASE_URL}/api/tabItems/${tabItemId}`,
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

const deleteTabItem = async (req: Request, res: Response) => {
  try {
    const { tabItemId } = req.params;

    const response = await fetch(
      `${TAB_MANAGEMENT_BASE_URL}/api/tabItems/${tabItemId}`,
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
  createTabItem,
  getAllTabItems,
  getTabItemById,
  getTabItemsByTabId,
  updateTabItem,
  deleteTabItem,
};
