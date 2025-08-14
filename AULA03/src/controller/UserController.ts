import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/User';

const userRepository = AppDataSource.getRepository(User);

export class UserController {
    // Listar todos os usuários com posts (GET /users)
    async list(req: Request, res: Response) {
        try {
            const users = await userRepository.find({ 
                relations: ['posts'],
                order: { id: 'ASC' } 
            });
            return res.json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Obter um usuário específico (GET /users/:id)
    async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await userRepository.findOne({ 
                where: { id: Number(id) },
                relations: ['posts']
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Criar novo usuário (POST /users)
    async create(req: Request, res: Response) {
        try {
            const { name, email } = req.body;
            
            // Validação simples
            if (!name || !email) {
                return res.status(400).json({ message: 'Name and email are required' });
            }

            const userExists = await userRepository.findOneBy({ email });
            if (userExists) {
                return res.status(409).json({ message: 'Email already in use' });
            }

            const user = userRepository.create({ name, email });
            await userRepository.save(user);
            
            return res.status(201).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Atualizar usuário (PATCH /users/:id)
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, email } = req.body;

            const user = await userRepository.findOneBy({ id: Number(id) });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Atualiza apenas os campos fornecidos
            if (name) user.name = name;
            if (email) {
                const emailExists = await userRepository.findOneBy({ email });
                if (emailExists && emailExists.id !== user.id) {
                    return res.status(409).json({ message: 'Email already in use by another user' });
                }
                user.email = email;
            }

            await userRepository.save(user);
            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Deletar usuário (DELETE /users/:id)
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await userRepository.findOneBy({ id: Number(id) });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await userRepository.remove(user);
            return res.status(204).send(); // No Content
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}