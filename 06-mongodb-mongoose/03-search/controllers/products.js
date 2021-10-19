const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const search = ctx.query;
  const products = await Product
      .find({$text: {$search: search}}, {score: {$meta: 'textScore'}})
      .sort({score: {$meta: 'textScore'}});
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
