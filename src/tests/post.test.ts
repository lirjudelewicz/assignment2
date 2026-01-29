import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import postRouter from '../routes/postRoutes';
import { postModel } from '../models/postModel';

jest.mock('../models/postModel');

const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const user = req.headers.authorization ? { _id: 'user123' } : null;
  (req as any).user = user;
  next();
});

app.use('/post', postRouter);

describe('Post Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /post', () => {
    it('should get all posts successfully', async () => {
      const posts = [
        { _id: '1', title: 'Post 1', content: 'Content 1', userId: 'user1' },
        { _id: '2', title: 'Post 2', content: 'Content 2', userId: 'user2' },
      ];

      (postModel.find as jest.Mock).mockResolvedValue(posts);

      const response = await request(app)
        .get('/post')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should return empty array if no posts exist', async () => {
      (postModel.find as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/post')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /post', () => {
    it('should create a new post successfully', async () => {
      const newPost = {
        userId: 'user123',
        title: 'New Post',
        content: 'New Content',
      };

      (postModel.create as jest.Mock).mockResolvedValue({
        _id: '1',
        ...newPost,
      });

      const response = await request(app)
        .post('/post')
        .set('Authorization', 'Bearer token')
        .send(newPost)
        .expect(200);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe(newPost.title);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/post')
        .set('Authorization', 'Bearer token')
        .send({ title: 'Missing Content' })
        .expect(400);

      expect(response.text).toContain('required');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/post')
        .send({
          userId: 'user123',
          title: 'New Post',
          content: 'New Content',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /post/:postId', () => {
    it('should get a post by id successfully', async () => {
      const post = {
        _id: '1',
        title: 'Post 1',
        content: 'Content 1',
        userId: 'user1',
      };

      (postModel.findById as jest.Mock).mockResolvedValue(post);

      const response = await request(app)
        .get('/post/1')
        .expect(200);

      expect(response.body._id).toBe('1');
      expect(response.body.title).toBe('Post 1');
    });

    it('should return 404 if post not found', async () => {
      (postModel.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/post/nonexistent')
        .expect(404);

      expect(response.text).toContain('not found');
    });
  });

  describe('PUT /post/:postId', () => {
    it('should update a post successfully', async () => {
      const updatedPost = {
        _id: '1',
        title: 'Updated Post',
        content: 'Updated Content',
        userId: 'user123',
      };

      (postModel.findById as jest.Mock).mockResolvedValue({
        ...updatedPost,
        userId: 'user123',
      });

      (postModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedPost);

      const response = await request(app)
        .put('/post/1')
        .set('Authorization', 'Bearer token')
        .send(updatedPost)
        .expect(200);

      expect(response.body.title).toBe('Updated Post');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .put('/post/1')
        .set('Authorization', 'Bearer token')
        .send({ title: 'Missing fields' })
        .expect(400);

      expect(response.text).toContain('required');
    });

    it('should return 404 if post not found', async () => {
      (postModel.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/post/nonexistent')
        .set('Authorization', 'Bearer token')
        .send({
          userId: 'user123',
          title: 'Updated',
          content: 'Updated',
        })
        .expect(404);

      expect(response.text).toContain('not found');
    });
  });

  describe('DELETE /post/:postId', () => {
    it('should delete a post successfully', async () => {
      (postModel.findById as jest.Mock).mockResolvedValue({
        _id: '1',
        userId: 'user123',
      });

      (postModel.findByIdAndDelete as jest.Mock).mockResolvedValue({
        _id: '1',
      });

      const response = await request(app)
        .delete('/post/1')
        .set('Authorization', 'Bearer token')
        .send({ userId: 'user123' })
        .expect(200);

      expect(postModel.findByIdAndDelete).toHaveBeenCalled();
    });

    it('should return 400 if postId is missing', async () => {
      const response = await request(app)
        .delete('/post/')
        .set('Authorization', 'Bearer token')
        .expect(404);
    });

    it('should return 404 if post not found', async () => {
      (postModel.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete('/post/nonexistent')
        .set('Authorization', 'Bearer token')
        .send({ userId: 'user123' })
        .expect(404);

      expect(response.text).toContain('not found');
    });
  });
});