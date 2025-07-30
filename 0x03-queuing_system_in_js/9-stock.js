const { createClient } = require('redis');
const express = require('express');
const { promisify } = require('util'); 
const app = express();
const port = 1245;


const listProducts = [
  {Id: 1, name: 'Suitcase 250' , price: 50, stock: 4},
  {Id: 2, name: 'Suitcase 450' , price: 100, stock: 10},
  {Id: 3, name: 'Suitcase 650' , price: 350, stock: 2},
  {Id: 4, name: 'Suitcase 1050' , price: 550, stock: 5}
];

function getItemById(id) {
  for (const product of listProducts) {
    if (product.Id === id) {
      return(product);
    }
  }
}

const client = createClient();
client
  .on('connect', () => {
    console.log("Redis client connected to the server")
  })
  .on("error", (err) => {
    console.log('Redis client not connected to the server:', err);
  });

const get = promisify(client.get).bind(client);

function reserveStockById(itemId, stock) {
  client.incrby(`item.${itemId}`, stock, (err, val) => {
    if(err) {
      console.error('cannot increment reserveStock:', err);
    }
  });
}

async function getCurrentReservedStockById(itemId) {
  try {
    const res = await get(`item.${itemId}`);
    if(res) {
      return(res);
    }
    return(0);
  } catch (err) {
    console.error('there is an Error:', err);
  }
}

function formatProduct(product) {
  const item = {};
  item.itemId = product.Id
  item.itemName = product.name
  item.price = product.price
  item.initialAvailableQuantity = product.stock
  return(item);
}

app.get('/list_products', (req, res) => {
  const productList = [];
  for (const product of listProducts) {
    productList.push(formatProduct(product));
  }
  res.json(productList);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = getItemById(itemId);
  if(!product) {
    res.json({"status":"Product not found"});
  } else {
    const item = formatProduct(product);
    const reservedStock = await getCurrentReservedStockById(itemId);
    item.currentQuantity = product.stock - reservedStock;
    res.json(item);
  }
});


app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = getItemById(itemId);
  if(!product) {
    res.json({"status":"Product not found"});
  } else {
    const reservedStock = await getCurrentReservedStockById(itemId);
    if ((product.stock - reservedStock) > 0) {
      reserveStockById(req.params.itemId, 1);
      res.json({"status":"Reservation confirmed","itemId":itemId});
    } else {
      res.json({"status":"Not enough stock available","itemId":itemId});
    }
  }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
