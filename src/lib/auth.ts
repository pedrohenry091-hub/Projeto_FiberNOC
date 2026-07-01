import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import prisma from '../database/database.js';
import { AppError } from './errors.js';

declare global {
  namespace Express {
    interface Request {
      user?: { username: string };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const SALT_ROUNDS = 10;

const USERS: Record<string, string> = {
  admin: '$2b$10$ydI.MYbIwjoPp0bbMtmfzunEn5zbMKM1H.c91EV06JEuddbfzLuGC',
  fibernoc: '$2b$10$JhoXlidBWoLa/LP.e7uEEOrEaSS5PxdNDdmbs8Frn5CPuqi1bieIm',
  tecnico: '$2b$10$vVDoP3P9mgs6u0hDR2OizuP4RLWscu92./cOm8JSYbPWELM9ld9ke'
};

const fallbackUsers = new Map<string, { username: string; password: string; role: string; createdAt: string }>();

for (const [username, password] of Object.entries(USERS)) {
  fallbackUsers.set(username, {
    username,
    password,
    role: 'user',
    createdAt: new Date(0).toISOString()
  });
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { username: string };
}

export async function createUser(username: string, password: string) {
  const hashedPassword = await hashPassword(password);

  try {
    const createdUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date().toISOString()
      }
    });

    return createdUser;
  } catch {
    const user = {
      username,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    fallbackUsers.set(username, user);
    return user;
  }
}

export async function findUserByUsername(username: string) {
  try {
    const userFromDb = await prisma.user.findUnique({ where: { username } });
    if (userFromDb) {
      return userFromDb;
    }
  } catch {
    // fallback abaixo
  }

  return fallbackUsers.get(username) ?? null;
}

export async function authenticateUser(username: string, password: string) {
  const user = await findUserByUsername(username);

  if (!user) {
    return null;
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return null;
  }

  return { username: user.username };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('Token de autenticação ausente.', 401));
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    next(new AppError('Token inválido ou expirado.', 401));
  }
}
