import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import {
  createTabValidation,
  updateTabValidation,
} from "../validation/tabValidation";

/**
 * Create Tab
 */
export const createTab = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      venueId,
      paymentMethodId,
      posTabReference,
      preAuthAmountPesewas,
      status,
    } = req.body;

    const { valid, errors } = createTabValidation({
      userId,
      venueId,
      paymentMethodId,
      posTabReference,
      preAuthAmountPesewas,
      status,
    });

    if (!valid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const tab = await prisma.tab.create({
      data: {
        userId,
        venueId,
        paymentMethodId,
        posTabReference,
        preAuthAmountPesewas,
        status,
      },
    });

    return res.status(201).json({
      success: true,
      data: tab,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get All Tabs
 */
export const getTabs = async (req: Request, res: Response) => {
  try {
    const tabs = await prisma.tab.findMany({
      orderBy: {
        openedAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: tabs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get Tab By ID
 */
export const getTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const tab = await prisma.tab.findUnique({
      where: {
        id: String(tabId),
      },
    });

    if (!tab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: tab,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Update Tab
 */
export const updateTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const {
      userId,
      venueId,
      paymentMethodId,
      posTabReference,
      preAuthAmountPesewas,
      status,
    } = req.body;

    const { valid, errors } = updateTabValidation({
      userId,
      venueId,
      paymentMethodId,
      posTabReference,
      preAuthAmountPesewas,
      status,
    });

    if (!valid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const existingTab = await prisma.tab.findUnique({
      where: {
        id: String(tabId),
      },
    });

    if (!existingTab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found",
      });
    }

    const updatedTab = await prisma.tab.update({
      where: {
        id: String(tabId),
      },
      data: {
        userId: userId ?? existingTab.userId,
        venueId: venueId ?? existingTab.venueId,
        paymentMethodId: paymentMethodId ?? existingTab.paymentMethodId,
        posTabReference: posTabReference ?? existingTab.posTabReference,
        preAuthAmountPesewas:
          preAuthAmountPesewas ?? existingTab.preAuthAmountPesewas,
        // status: status ?? existingTab.status,
        lastActivityAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedTab,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Delete Tab
 */
export const deleteTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const existingTab = await prisma.tab.findUnique({
      where: {
        id: String(tabId),
      },
    });

    if (!existingTab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found",
      });
    }

    await prisma.tab.delete({
      where: {
        id: String(tabId),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Tab deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Activate Tab
 * OPEN -> ACTIVE
 */
export const activateTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const tab = await prisma.tab.findUnique({
      where: { id: String(tabId) },
    });

    if (!tab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found",
      });
    }

    if (tab.status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "Only OPEN tabs can be activated",
      });
    }

    const updatedTab = await prisma.tab.update({
      where: { id: String(tabId) },
      data: {
        status: "ACTIVE",
        lastActivityAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedTab,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Settle Tab
 * ACTIVE -> PENDING_SETTLEMENT
 */
export const settleTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const tab = await prisma.tab.findUnique({
      where: { id: String(tabId) },
    });

    if (!tab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found",
      });
    }

    if (tab.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Only ACTIVE tabs can be moved to settlement",
      });
    }

    const updatedTab = await prisma.tab.update({
      where: { id: String(tabId) },
      data: {
        status: "PENDING_SETTLEMENT",
        lastActivityAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedTab,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Close Tab
 * PENDING_SETTLEMENT -> CLOSED
 */
export const closeTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const tab = await prisma.tab.findUnique({
      where: { id: String(tabId) },
    });

    if (!tab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found",
      });
    }

    if (tab.status !== "PENDING_SETTLEMENT") {
      return res.status(400).json({
        success: false,
        message: "Only tabs awaiting settlement can be closed",
      });
    }

    const updatedTab = await prisma.tab.update({
      where: { id: String(tabId) },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
        lastActivityAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedTab,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Abandon Tab
 * OPEN/ACTIVE -> ABANDONED
 */
export const abandonTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const tab = await prisma.tab.findUnique({
      where: { id: String(tabId) },
    });

    if (!tab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found",
      });
    }

    if (tab.status !== "OPEN" && tab.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Only OPEN or ACTIVE tabs can be abandoned",
      });
    }

    const updatedTab = await prisma.tab.update({
      where: { id: String(tabId) },
      data: {
        status: "ABANDONED",
        closedAt: new Date(),
        lastActivityAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedTab,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Reopen Tab
 * ABANDONED -> OPEN
 */
export const reopenTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const tab = await prisma.tab.findUnique({
      where: { id: String(tabId) },
    });

    if (!tab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found",
      });
    }

    if (tab.status !== "ABANDONED") {
      return res.status(400).json({
        success: false,
        message: "Only abandoned tabs can be reopened",
      });
    }

    const updatedTab = await prisma.tab.update({
      where: { id: String(tabId) },
      data: {
        status: "OPEN",
        closedAt: null,
        lastActivityAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedTab,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
