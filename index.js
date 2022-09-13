const express = require("express");
const bodyParser = require("body-parser");
const mercadopago = require("mercadopago");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mercadopago.configure({
    access_token: "APP_USR-1125146177585069-090711-fa9be3e6c3839c69822af123df040841-236426650",
  });

let products = [
    {
        id: 1,
        name: "Landing Page",
        price: 10000,
        priceConSignos: "$10.000",
        image: "./img/shop img/landing-pages-14-11.png",
        stock: 4,
        
    },

    {
        id: 2,
        name: "Sitio Web",
        price: 15000,
        priceConSignos: "$15.000",
        image: "./img/shop img/landing-pages-14-11.png",
        stock: 3,
    
    },

    {
        id: 3,
        name: "E-commerce",
        price: 27000,
        priceConSignos: "$27.000",
        image: "./img/shop img/landing-pages-14-11.png",
        stock: 2,
        
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


