const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const mercadopago = require("mercadopago");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mercadopago.configure({
    access_token: "TEST-1125146177585069-090711-e9f64375f382a09361d09cb9313e6a74-236426650",
  });

let products = [
    {
        id: 1,
        name: "Landing Page",
        price: 10000,
        image: "./img/shop img/landing-pages-14-11.png",
        stock: 100,
    },

    {
        id: 2,
        name: "Sitio Web",
        price: 15000,
        image: "./img/shop img/landing-pages-14-11.png",
        stock: 100,
    },

    {
        id: 3,
        name: "E-commerce",
        price: 27000,
        image: "./img/shop img/landing-pages-14-11.png",
        stock: 100,
    },
]


app.get('/api/products', (req, res) => {
  res.send(products)
})

app.post('/api/pay', (req, res) => {
    const ids = req.body;
    const productsCopy = products.map(p => ({...p}))
    ids.forEach(id => {
        const product = productsCopy.find(p => p.id === id);
        if(product.stock > 0){
        product.stock--;
        }
        else{
            throw("Sin Stock");
        }
    });
    products = productsCopy
    res.send(products);
  })

app.use("/", express.static("frontend"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


