import { createClient } from "redis";
import { promisify } from "util";
import express from "express";

const app = express();
const client = createClient();

const listProducts = [
  { Id: 1, name: "Suitcase 250", price: 50, stock: 4 },
  { Id: 2, name: "Suitcase 450", price: 100, stock: 10 },
  { Id: 3, name: "Suitcase 650", price: 350, stock: 2 },
  { Id: 4, name: "Suitcase 1050", price: 550, stock: 5 },
];

const getItemById = (id) => {
  const list = listProducts.filter((item) => item.Id == id);
  return list[0];
};

app.get("/list_products", (req, res) => {
  res.json(listProducts);
});

client.on("connect", () => {
  for (let item of listProducts) {
    client.set(item.Id, item.stock);
  }
});

const reserveStockById = (itemId, stock) => {
  client.set(itemId, stock - 1);
};

const asyncGet = promisify(client.get).bind(client);

const getCurrentReservedStockById = async (itemId) => {
  const stock = await asyncGet(itemId);
  return stock;
};

app.get("/list_products/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  const item = getItemById(itemId);
  const stock = await getCurrentReservedStockById(itemId);
  if (item) {
    res.json({
      itemId: item.id,
      itemName: item.name,
      price: item.price,
      initialAvailableQuantity: item.stock,
      currentQuantity: stock,
    });
  } else {
    res.json({ status: "Product not found" });
  }
});

app.get("/reserve_product/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  const item = getItemById(itemId);
  if (!item) {
    res.json({ status: "Product not found" });
  } else {
    const stock = await getCurrentReservedStockById(itemId);
    if (stock < 1) {
      res.status(404).json({ status: "Not enough stock available", itemId: 1 });
    } else {
      reserveStockById(itemId, stock);
      res.json(`{"status":"Reservation confirmed","itemId": ${itemId}}`);
    }
  }
});

app.listen(1245, () => {
  console.log("server is running");
});
