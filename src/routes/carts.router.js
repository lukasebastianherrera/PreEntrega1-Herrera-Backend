import { Router } from "express";
import { CartManager, Cart } from "../CartManager.js";

const router = Router();

const cartManager = new CartManager("./Carritos.json")



router.post("/", async (req, res) => {
    const carts = cartManager.getCarts();
    const {quantity , products } =  req.body;
    const cart = new Cart(products, quantity)
    try{
        await cartManager.saveCarts(cart); 
        res.json({
            status: "creado",
            cart,
        })
    }  catch(e) {
        console.error("error al crear el carrito", e)
        res.status(500).json({
            error: "Hubo un error al crear el carrito",
            details: error.message
        });

    }
    cartManager.saveCarts(); 
    // ejemplo para enviar desde postman
    // {
    //     "products": []
    // }
})

router.get("/:cid", async (req, res) =>{
    const cid = Number(req.params.cid);

    try {
        const cart = await cartManager.getCartById(cid);
        if (cart) {
            res.json({
                ID: cart.id,
                products: cart.products,
            });
        } else {
            res.json({
                error: `El carrito con el id ${cid} no fue encontrado`,
            });
        }
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.json({
            error: "Hubo un error al obtener el carrito",
        });
    }
});
// http://localhost:8080/api/carts/ (enviar {} desde body)

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        const { cid, pid } = req.params;
        const index = carts.findIndex((cart) => cart.id === Number(cid));

        if (index == -1) {
        return res.json("Carrito no encontrado");
        }
        const cartExist = carts[index];
        const productIndex = cartExist.products.findIndex((prod) => prod.product === Number(pid)
        );
        if (productIndex == -1) {
            cartExist.products.push({
            product: Number(pid),
            quantity: 1,
        });
        } else {
        cartExist.products[productIndex].quantity++;
        }
        carts[index] = cartExist;
        await cartManager.saveCarts(carts)
        res.json(cartExist)
    } catch {
        console.error("Error al agregar el producto al carrito", error); 
        res.send("Error al agregar producto", error);
    }
    // para enviar desde body
    // {
    //     "product": 1,
    //     "quantity": 1
    // }
})


export default router;
