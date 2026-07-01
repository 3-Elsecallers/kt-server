import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import {
  createUserValidation,
  updateUserValidation,
} from "../validation/userValidation";

/**
 * Create User
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body ?? {};

    const { valid, errors } = createUserValidation({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    if (!valid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already exists"
            : "Phone number already exists",
      });
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
    });

    return res.status(201).json({
      success: true,
      data: user,
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
 * Sign In User With Email and Phone number
 */
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body ?? {};

    if (!email || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Email and phone number are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email) },
    });

    if (!user || user.phoneNumber !== String(phoneNumber)) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
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
 * Get All Users
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get User By ID
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
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
 * Update User
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, phoneNumber } = req.body ?? {};

    const { valid, errors } = updateUserValidation({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    if (!valid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: String(userId) },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email || phoneNumber) {
      const duplicate = await prisma.user.findFirst({
        where: {
          id: { not: String(userId) },
          OR: [email ? { email } : {}, phoneNumber ? { phoneNumber } : {}],
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            duplicate.email === email
              ? "Email already exists"
              : "Phone number already exists",
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: String(userId) },
      data: {
        firstName: firstName ?? existingUser.firstName,
        lastName: lastName ?? existingUser.lastName,
        email: email ?? existingUser.email,
        phoneNumber: phoneNumber ?? existingUser.phoneNumber,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedUser,
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
 * Delete User
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: { id: String(userId) },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: { id: String(userId) },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
