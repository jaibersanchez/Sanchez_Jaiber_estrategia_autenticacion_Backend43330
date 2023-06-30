import express from 'express';
import { ProductService } from '../services/products.service.js';

const Service = new ProductService();

export const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const products = await Service.getAll(req.query);
    return res.status(200).json({
      status: 'success',
      msg: 'listado de productos',
      payload: products,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      payload: {},
    });
  }
});

productsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Service.getOneById(id);
    return res.status(200).json({
      status: 'success',
      msg: 'listado de productos',
      payload: product,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      payload: {},
    });
  }
});

productsRouter.post('/', async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock, category, status } = req.body;

    const productCreated = await Service.createOne(title, description, price, thumbnail, code, stock, category, status);
    return res.status(201).json({
      status: 'success',
      msg: 'product created',
      payload: productCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      payload: {},
    });
  }
});

productsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, thumbnail, code, stock, category, status } = req.body;

    const productUptaded = await Service.updateOne(id, title, description, price, thumbnail, code, stock, category, status);

    return res.status(201).json({
      status: 'success',
      msg: 'product uptaded',
      payload: productUptaded,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      payload: {},
    });
  }
});

productsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Service.deleteOne(id);
    return res.status(200).json({
      status: 'success',
      msg: 'product deleted',
      payload: {},
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      payload: {},
    });
  }
});