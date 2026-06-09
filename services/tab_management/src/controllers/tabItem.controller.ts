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
    const { tabId, posItemId, itemName, quantity, unitPricePesewas } = req.body;

    const { valid, errors } = createTabItemValidation({
      tabId,
      posItemId,
      itemName,
      quantity,
      unitPricePesewas,
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

    const totalPricePesewas = quantity * unitPricePesewas;

    const item = await prisma.$transaction(async (tx) => {
      const createdItem = await tx.tabItem.create({
        data: {
          tabId,
          posItemId,
          itemName,
          quantity,
          unitPricePesewas,
          totalPricePesewas,
        },
      });

      await tx.tab.update({
        where: {
          id: tabId,
        },
        data: {
          runningTotalPesewas: {
            increment: totalPricePesewas,
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

    const { posItemId, itemName, quantity, unitPricePesewas } = req.body;

    const { valid, errors } = updateTabItemValidation({
      posItemId,
      itemName,
      quantity,
      unitPricePesewas,
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

    const newUnitPrice = unitPricePesewas ?? existingItem.unitPricePesewas;

    const newTotal = newQuantity * newUnitPrice;

    const difference = newTotal - existingItem.totalPricePesewas;

    const updatedItem = await prisma.$transaction(async (tx) => {
      const item = await tx.tabItem.update({
        where: {
          id: String(itemId),
        },
        data: {
          posItemId: posItemId ?? existingItem.posItemId,
          itemName: itemName ?? existingItem.itemName,
          quantity: newQuantity,
          unitPricePesewas: newUnitPrice,
          totalPricePesewas: newTotal,
        },
      });

      await tx.tab.update({
        where: {
          id: existingItem.tabId,
        },
        data: {
          runningTotalPesewas: {
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
          runningTotalPesewas: {
            decrement: existingItem.totalPricePesewas,
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

export const getTabItemsByTabId = async (
  req: Request,
  res: Response
) => {
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