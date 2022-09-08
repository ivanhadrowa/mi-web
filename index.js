const express = require("express");
const bodyParser = require("body-parser");
const mercadopago = require("mercadopago");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mercadopago.configure({
    access_token: "APP_USR-bf1b3703-93d1-40b1-9d5e-08f478a94918",
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

app.post('/api/pay', async (req, res) => {
    const ids = req.body;
    const productsCopy = products.map(p => ({...p}))

    let preference = {
        items: [],
        back_urls: {
            success: "http://localhost:3000/feedback",
            failure: "http://localhost:3000/feedback",
            pending: "http://localhost:3000/feedback",
          },
          auto_return: "approved",

      };
      
    let error = false;
    ids.forEach((id) => {
        const product = products.find((p) => p.id === id);
        if(product.stock > 0){
        product.stock--;
            preference.items.push({
            title: product.name,
            unit_price: product.price,
            quantity: 1,
            });
        }
        
        else{
           error = true;
        }
    });

    if(error){
        res.send("Sin Stock").statusCode(400);
    }else{
        const response = await mercadopago.preferences.create(preference);
        const preferenceId = response.body.id;
        res.send({ preferenceId });
    }
});

app.get('/feedback', function(request, response) {
    response.json({
     Payment: request.query.payment_id,
     Status: request.query.status,
     MerchantOrder: request.query.merchant_order_id
   })
  });

app.use("/", express.static("frontend"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


