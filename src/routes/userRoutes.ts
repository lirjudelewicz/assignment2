import { Router } from "express";
import userController from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const userRouter = Router();

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve all users from the database, optionally filtered by query parameters
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: No users in the database
 *       500:
 *         description: Server error
 */
userRouter.get("/", userController.getAll.bind(userController));

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRouter.post("/:userId", userController.getById.bind(userController));

/**
 * @swagger
 * /user/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     description: Update user information. Users can only update their own data.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439012"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - missing required fields
 *       403:
 *         description: Forbidden - can only update own user data
 *       404:
 *         description: User not found
 *       409:
 *         description: Conflict - username or email already in use
 *       500:
 *         description: Server error
 */
userRouter.put("/:userId", authenticate, userController.update.bind(userController));

/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     description: Delete a user account. Users can only delete their own account.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden - can only delete own user account
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRouter.delete("/:userId", authenticate, userController.delete.bind(userController));

export default userRouter;