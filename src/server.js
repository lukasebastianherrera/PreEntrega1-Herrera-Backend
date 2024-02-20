import express from "express"
import cartsRouter from  "./routes/carts.router.js"
import productsRouter from "./routes/products.router.js"

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
    res.send("<h1>Bienvenido Tutor 👌 </h1>")
} )

app.use("/api/products", productsRouter);

app.use("/api/carts", cartsRouter)


app.listen(8080, () =>  console.log(`servidor escuchando en 8080`))