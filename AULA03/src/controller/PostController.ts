import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Post } from '../models/Post';
import { User } from '../models/User';

const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export class PostController {
    // Listar todos os posts (GET /posts)
    async list(req: Request, res: Response) {
        try {
            const posts = await postRepository.find({ 
                relations: ['user'],
                order: { id: 'ASC' }
            });
            return res.json(posts);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Obter um post específico (GET /posts/:id)
    async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const post = await postRepository.findOne({ 
                where: { id: Number(id) },
                relations: ['user']
            });

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.json(post);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Criar novo post (POST /posts)
    async create(req: Request, res: Response) {
        try {
            const { title, userId } = req.body;
            
            if (!title || !userId) {
                return res.status(400).json({ message: 'Title and userId are required' });
            }

            const user = await userRepository.findOneBy({ id: Number(userId) });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const post = postRepository.create({ title, user });
            await postRepository.save(post);
            
            return res.status(201).json(post);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Atualizar post (PATCH /posts/:id)
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, userId } = req.body;

            const post = await postRepository.findOneBy({ id: Number(id) });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Atualiza o título se fornecido
            if (title) post.title = title;

            // Atualiza o usuário se userId for fornecido
            if (userId) {
                const user = await userRepository.findOneBy({ id: Number(userId) });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                post.user = user;
            }

            await postRepository.save(post);
            return res.json(post);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Deletar post (DELETE /posts/:id)
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const post = await postRepository.findOneBy({ id: Number(id) });
            
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            await postRepository.remove(post);
            return res.status(204).send(); // No Content
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}