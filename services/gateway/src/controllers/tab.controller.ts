import { Request, Response } from "express";
import "dotenv/config";

const { TAB_MANAGEMENT_BASE_URL } = process.env;

const createTab = async (req: Request, res: Response) => {
  try {
    const payload = req.body ?? {};

    const response = await fetch(`${TAB_MANAGEMENT_BASE_URL}/api/tabs`, {
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

const getAllTabs = async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${TAB_MANAGEMENT_BASE_URL}/api/tabs`);

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

const getTabById = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const response = await fetch(`${TAB_MANAGEMENT_BASE_URL}/api/tabs/${tabId}`);
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const updateTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;
    const payload = req.body;

    const response = await fetch(
      `${TAB_MANAGEMENT_BASE_URL}/api/tabs/${tabId}`,
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

const deleteTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const response = await fetch(
      `${TAB_MANAGEMENT_BASE_URL}/api/tabs/${tabId}`,
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

const activateTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const response = await fetch(`${TAB_MANAGEMENT_BASE_URL}/api/tabs/${tabId}/activate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const settleTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const response = await fetch(`${TAB_MANAGEMENT_BASE_URL}/api/tabs/${tabId}/settle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const closeTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const response = await fetch(`${TAB_MANAGEMENT_BASE_URL}/api/tabs/${tabId}/close`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const abandonTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const response = await fetch(`${TAB_MANAGEMENT_BASE_URL}/api/tabs/${tabId}/abandon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const reopenTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const response = await fetch(`${TAB_MANAGEMENT_BASE_URL}/api/tabs/${tabId}/reopen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export default {
  createTab,
  getAllTabs,
  getTabById,
  updateTab,
  deleteTab,
  activateTab,
  settleTab,
  closeTab,
  abandonTab,
  reopenTab
};
