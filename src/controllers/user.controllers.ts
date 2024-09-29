import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";
import { encrypt } from "../helpers/encrypt";
import * as cache from "memory-cache";

export class UserController {
  static async signup(req: Request, res: Response) {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields: name, email, or password",
      });
    }

    try {
      const userRepository = AppDataSource.getRepository(User);

      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const encryptedPassword = await encrypt.encryptpass(password);
      const user = new User();
      user.name = name;
      user.email = email;
      user.password = encryptedPassword;
      user.role = role || "user";

      await userRepository.save(user);

      const token = encrypt.generateToken({ id: user.id });

      return res.status(201).json({
        message: "User created successfully",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while creating the user",
        error: error.message,
      });
    }
  }

  static async getUsers(req: Request, res: Response) {
    const cachedData = cache.get("data");
    if (cachedData) {
      return res.status(200).json({
        data: cachedData,
      });
    }

    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();
      cache.put("data", users, 6000);

      return res.status(200).json({
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while retrieving users",
        error: error.message,
      });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        message:
          "At least one field (name or email) must be provided for update.",
      });
    }

    try {
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) user.name = name;
      if (email) user.email = email;

      await userRepository.save(user);

      return res.status(200).json({
        message: "User updated successfully",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while updating the user",
        error: error.message,
      });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await userRepository.remove(user);

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while deleting the user",
        error: error.message,
      });
    }
  }
}
