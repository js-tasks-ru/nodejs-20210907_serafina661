const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const productsBySubcategory = await Product.find(subcategory);

  ctx.status = 200;
  if (productsBySubcategory.length) {
    ctx.body = {
      products: productsBySubcategory.map((product) => ({
        id: product._id,
        title: product.title,
        images: product.images,
        category: product.category,
        price: product.price,
        description: product.description,
      })),
    };
  } else {
    ctx.body = {
      products: [],
    };
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.status = 200;
  if (products.length) {
    ctx.body = {
      products: products.map((product) => ({
        id: product._id,
        title: product.title,
        images: product.images,
        category: product.category,
        price: product.price,
        description: product.description,
      })),
    };
  } else {
    ctx.body = {
      products: [],
    };
  }
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const productById = await Product.findById(id);
    if (productById) {
      ctx.status = 200;
      ctx.body = {
        product: {
          id: productById._id,
          title: productById.title,
          images: productById.images,
          category: productById.category,
          price: productById.price,
          description: productById.description,
        },
      };
    } else {
      ctx.status = 404;
    }
  } else {
    ctx.status = 400;
  }
};

