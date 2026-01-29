import { Router } from "express";
import commentController from "../controllers/commentController";
import { authenticate } from "../middleware/authMiddleware";

const commentsRouter = Router();

/**
 * @swagger
 * /comment:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Create a new comment
 *     description: Create a new comment on a post. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - senderId
 *               - message
 *             properties:
 *               postId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               senderId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               message:
 *                 type: string
 *                 example: "Great post!"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Server error
 */
commentsRouter.post("/", authenticate, commentController.create.bind(commentController));

/**
 * @swagger
 * /comment/{commentId}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get a comment by ID
 *     description: Retrieve a specific comment by its ID
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439013"
 *     responses:
 *       200:
 *         description: Comment details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request - missing commentId
 *       500:
 *         description: Server error
 */
commentsRouter.get("/:commentId", commentController.getById.bind(commentController));

/**
 * @swagger
 * /comment/{commentId}:
 *   put:
 *     tags:
 *       - Comments
 *     summary: Update a comment
 *     description: Update an existing comment. Only the comment creator can update it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439013"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - senderId
 *               - message
 *             properties:
 *               postId:
 *                 type: string
 *               senderId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - not the comment creator
 *       500:
 *         description: Server error
 */
commentsRouter.put("/:commentId", authenticate, commentController.update.bind(commentController));

/**
 * @swagger
 * /comment/{commentId}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete a comment
 *     description: Delete a comment by ID. Only the comment creator can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439013"
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Bad request - missing commentId
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - not the comment creator
 *       500:
 *         description: Server error
 */
commentsRouter.delete("/:commentId", authenticate, commentController.delete.bind(commentController));

/**
 * @swagger
 * /comment/post/{postId}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get comments by post ID
 *     description: Retrieve all comments for a specific post
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: List of comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request - missing postId
 *       500:
 *         description: Server error
 */
commentsRouter.get("/post/:postId", commentController.getCommentsByPostId.bind(commentController));

export default commentsRouter;