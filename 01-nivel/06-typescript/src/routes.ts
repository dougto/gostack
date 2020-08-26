import { Request, Response } from 'express';
import createUser from './services/CreateUser';

export function helloWorld(req: Request, res: Response) {
  const user = createUser({
    name: 'nome',
    email: 'mail',
    password: 'senha',
    techs: ['tech 1', 'tech 2']
  });

  return res.json({ user });
}
