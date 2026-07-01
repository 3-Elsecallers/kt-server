import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import {
  createTabItemValidation,
  updateTabItemValidation,
} from "../validation/tabItemValidation";

/**
 * Create Tab Item
 */
export const createTabItem = async (req: Request, res: Response) => {
  try {
    const { tabId, posItemId, itemName, quantity, unitPrice } = req.body;

    const { valid, errors } = createTabItemValidation({
      tabId,
      posItemId,
      itemName,
      quantity,
      unitPrice,
    });

    if (!valid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

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

    const totalPrice = Number(quantity) * Number(unitPrice);
    // const newTotal = totalPrice + Number(tab.runningTotal);

    // // Check if the order overshoots the pre-auth threshold
    // if (newTotal > Number(tab.preAuthAmount)) {
    //   // Return 402 Payment Required so POS software forces a step-up authorization hold
    //   return res.status(402).json({
    //     error: "Pre-auth limit exceeded. Authorize additional top-up funds.",
    //     currentBalance: tab.runningTotal,
    //     attemptedCharge: totalPrice,
    //   });
    // }

    const item = await prisma.$transaction(async (tx) => {
      const createdItem = await tx.tabItem.create({
        data: {
          tabId,
          posItemId,
          itemName,
          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
          totalPrice,
        },
      });

      await tx.tab.update({
        where: {
          id: tabId,
        },
        data: {
          runningTotal: {
            increment: totalPrice,
          },
          lastActivityAt: new Date(),
        },
      });

      return createdItem;
    });

    return res.status(201).json({
      success: true,
      data: item,
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
 * Get All Tab Items
 */
export const getTabItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.tabItem.findMany({
      orderBy: {
        orderedAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: items,
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
 * Get Tab Item By ID
 */
export const getTabItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    const item = await prisma.tabItem.findUnique({
      where: {
        id: String(itemId),
      },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Tab item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
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
 * Update Tab Item
 */
export const updateTabItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    const { posItemId, itemName, quantity, unitPrice } = req.body;

    const { valid, errors } = updateTabItemValidation({
      posItemId,
      itemName,
      quantity,
      unitPrice,
    });

    if (!valid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const existingItem = await prisma.tabItem.findUnique({
      where: {
        id: String(itemId),
      },
    });

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Tab item not found",
      });
    }

    const newQuantity = quantity ?? existingItem.quantity;

    const newUnitPrice = unitPrice ?? existingItem.unitPrice;

    const newTotal = newQuantity * newUnitPrice;

    const difference = newTotal - Number(existingItem.totalPrice);

    const updatedItem = await prisma.$transaction(async (tx) => {
      const item = await tx.tabItem.update({
        where: {
          id: String(itemId),
        },
        data: {
          posItemId: posItemId ?? existingItem.posItemId,
          itemName: itemName ?? existingItem.itemName,
          quantity: newQuantity,
          unitPrice: newUnitPrice,
          totalPrice: newTotal,
        },
      });

      await tx.tab.update({
        where: {
          id: existingItem.tabId,
        },
        data: {
          runningTotal: {
            increment: difference,
          },
          lastActivityAt: new Date(),
        },
      });

      return item;
    });

    return res.status(200).json({
      success: true,
      data: updatedItem,
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
 * Delete Tab Item
 */
export const deleteTabItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    const existingItem = await prisma.tabItem.findUnique({
      where: {
        id: String(itemId),
      },
    });

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Tab item not found",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.tabItem.delete({
        where: {
          id: String(itemId),
        },
      });

      await tx.tab.update({
        where: {
          id: existingItem.tabId,
        },
        data: {
          runningTotal: {
            decrement: existingItem.totalPrice,
          },
          lastActivityAt: new Date(),
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Tab item deleted successfully",
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
 * Get Tab Items By Tab ID
 */

export const getTabItemsByTabId = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const items = await prisma.tabItem.findMany({
      where: {
        tabId: String(tabId),
      },
      orderBy: {
        orderedAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
