import { Request, Response } from "express";
import "dotenv/config";
import { calculateAmount } from "../utils/calculateAmount";

const { TAB_SERVICE_URL, PAYMENT_SERVICE_URL, USER_SERVICE_URL } = process.env;

const createTab = async (req: Request, res: Response) => {
  try {
    const payload = req.body ?? {};

    const response = await fetch(`${TAB_SERVICE_URL}/api/tabs`, {
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
    const response = await fetch(`${TAB_SERVICE_URL}/api/tabs`);

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

const getUserTab = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const response = await fetch(`${TAB_SERVICE_URL}/api/tabs/user/${userId}`);

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

const getVenueTabs = async (req: Request, res: Response) => {
  try {
    const { venueId } = req.params;

    const response = await fetch(`${TAB_SERVICE_URL}/api/tabs/venue/${venueId}`);

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

    const response = await fetch(`${TAB_SERVICE_URL}/api/tabs/${tabId}`);
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
      `${TAB_SERVICE_URL}/api/tabs/${tabId}`,
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
      `${TAB_SERVICE_URL}/api/tabs/${tabId}`,
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

    const response = await fetch(`${TAB_SERVICE_URL}/api/tabs/${tabId}/activate`, {
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

    const response = await fetch(`${TAB_SERVICE_URL}/api/tabs/${tabId}/settle`, {
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
    const { metadata } = req.body;

    // get tab
    const tabResponse = await fetch(`${TAB_SERVICE_URL}/api/tabs/${tabId}`);
    if (tabResponse.status !== 200) {
      return res.status(404).json({ success: false, message: "Tab not found" })
    }
    const tabJsonResponse = await tabResponse.json();
    const tab = tabJsonResponse.data;
    if (tab.status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "Only OPEN tabs can be closed"
      })
    }

    // get user
    const userResponse = await fetch(`${USER_SERVICE_URL}/api/users/${tab.userId}`);
    const userJsonResponse = await userResponse.json();
    const user = userJsonResponse.data;

    // get payment method
    const paymentMethodResponse = await fetch(`${PAYMENT_SERVICE_URL}/api/payments/${tab.paymentMethodId}`);
    const paymentMethodJsonResponse = await paymentMethodResponse.json();
    const paymentMethod = paymentMethodJsonResponse.data;

    // calculate amount
    const { vatAmount, totalDue } = calculateAmount(tab);

    const chargeResponse = await fetch(
      `${PAYMENT_SERVICE_URL}/api/payments/charge-authorization`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorizationCode: paymentMethod.authorizationCode,
          email: user.email,
          amount: totalDue,
          metadata
        }),
      },
    );

    if (chargeResponse.status !== 200) {
      return res.status(400).json({
        success: false,
        message: "Charge failed"
      })
    }

    const chargeJsonResponse = await chargeResponse.json();
    console.log({ chargeJsonResponse });

    const response = await fetch(`${TAB_SERVICE_URL}/api/tabs/${tabId}/close`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vatAmount,
        totalPaid: totalDue
      })
    });
    const jsonResponse = await response.json();
    const modifiedResponse = {
      ...jsonResponse,
      data: {
        ...jsonResponse.data,
        paymentMethod: paymentMethod.last4
      }
    }

    return res.status(response.status).json(modifiedResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const abandonTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const response = await fetch(`${TAB_SERVICE_URL}/api/tabs/${tabId}/abandon`, {
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

    const response = await fetch(`${TAB_SERVICE_URL}/api/tabs/${tabId}/reopen`, {
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
  getUserTab,
  getVenueTabs,
  getTabById,
  updateTab,
  deleteTab,
  activateTab,
  settleTab,
  closeTab,
  abandonTab,
  reopenTab
};
