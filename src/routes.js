import { Router } from 'express';
import User from './app/models/User';

const routes = new Router(); // Cria uma nova instância de Router do Express.

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Joan Pedro',
    email: 'joan@pedro.com.br',
    password_hash: '1231412515',
  });

  return res.json(user);
});

export default routes;
