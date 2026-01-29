import { Router } from "express";
import postController from "../controllers/postController";
import { authenticate } from "../middleware/authMiddleware";

const postsRouter = Router();

/**
 * @swagger
 * /post:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get all posts
 *     description: Retrieve all posts from the database, optionally filtered by query parameters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: List of posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error
 */
postsRouter.get("/", postController.getAll.bind(postController));

/**
 * @swagger
 * /post:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Create a new post
 *     description: Create a new post with title and content. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *               - content
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               title:
 *                 type: string
 *                 example: "My First Post"
 *               content:
 *                 type: string
 *                 example: "This is the content of my post"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Server error
 */
postsRouter.post("/", authenticate, postController.create.bind(postController));

/**
 * @swagger
 * /post/{postId}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get a post by ID
 *     description: Retrieve a specific post by its ID
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Post details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
postsRouter.get("/:postId", postController.getById.bind(postController));

/**
 * @swagger
 * /post/{postId}:
 *   put:
 *     tags:
 *       - Posts
 *     summary: Update a post
 *     description: Update an existing post. Only the post creator can update it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *               - content
 *             properties:
 *               userId:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - not the post creator
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
postsRouter.put("/:postId", authenticate, postController.replace.bind(postController));

/**
 * @swagger
 * /post/{postId}:
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Delete a post
 *     description: Delete a post by ID. Only the post creator can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       400:
 *         description: Bad request - missing postId
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - not the post creator
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
postsRouter.delete("/:postId", authenticate, postController.delete.bind(postController));

export default postsRouter;
