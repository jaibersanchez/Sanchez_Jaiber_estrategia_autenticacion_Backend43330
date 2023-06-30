import express from 'express';
import passport from 'passport';
import { isAdmin, isUser } from '../middleware/auth.js';

export const authRouter = express.Router();

authRouter.get('/perfil', isUser, (req, res) => {
  const user = { email: req.session.email, isAdmin: req.session.isAdmin };
  return res.render('perfil', { user: user });
});

authRouter.get('/admin', isUser, isAdmin, (req, res) => {
  return res.send('datos clasificados');
});

authRouter.post('/auth', async(req, res) => {
  const { email, pass } = req.body;
  
  const userSessionisAdmin = {
    isAdmin: 'adminCoder@coder.com',
    pass: 'adminCod3r123',
  };
  
  let errorMessage = '';

  try {
    const user = await userService.loginUser(email);

    if (email === userSessionisAdmin.email && pass === userSessionisAdmin.pass) {
      req.session.user = {
        email: userSessionisAdmin.email,
        role: 'admin',
        first_name: 'CoderAdmin',
      };
      res.redirect('/products'); 
      return;
    } else if (!user || !comparePassword(user,pass)) {
      errorMessage = 'Invalid email or password';
    } else {
      
      req.session.user = user;
      res.redirect('/products');
      return;
    }
  } catch (error) {
    console.log(error);
    errorMessage = 'An error occurred';
  }
  res.redirect(`/?error=${encodeURIComponent(errorMessage)}`);
});

authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: 'No se pudo cerrar su sesión :(' });
    } else {
      return res.redirect('/auth/login');
    }
  });
});

authRouter.get('/login', (req, res) => {
  return res.render('login', {});
});

authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), async (req, res) => {
  if (!req.user) {
    return res.json({ error: 'invalid credentials' });
  }
  req.session.user = {
    _id: req.user._id,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    isAdmin: req.user.isAdmin,
  };

  return res.json({ msg: 'ok', payload: req.user });
});

authRouter.get('/faillogin', async (req, res) => {
  return res.json({ error: 'fail to login' });
});

authRouter.get('/register', (req, res) => {
  return res.render('register', {});
});

authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), (req, res) => {
  if (!req.user) {
    return res.json({ error: 'something went wrong' });
  }
  req.session.user = {
    _id: req.user._id,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    isAdmin: req.user.isAdmin,
  };

  return res.json({ msg: 'ok', payload: req.user });
});

authRouter.get('/failregister', async (req, res) => {
  return res.json({ error: 'fail to register' });
});

authRouter.get('/session', (req, res) => {
  return res.send(JSON.stringify(req.session));
});