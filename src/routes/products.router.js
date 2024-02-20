import { Router } from "express";
import {ProductManager, Product } from "../ProductManager.js";
import { validarProducto } from "../utils/validarProducto.js";

const router = Router();

const productManager = new ProductManager("./Productos.json");
const products = productManager.getProducts();
productManager.saveProduct()


router.get("/", (req, res) => {
    const limit = req.query.limit;
    if(limit){
    res.json(products.slice(0, limit));
    } else{
    res.json(products)
    }
});

router.get("/:pid", (req, res) => {
    const pid = Number(req.params.pid);
    const product = productManager.getProductById(pid);
    if (product) {
        res.json(product);
    } else {
        res.send(`el producto con el id ${pid} no existe`);
    }
});
// http://localhost:8080/api/products/

router.post("/", validarProducto, async (req, res) =>{
    const { title, description, code, price, stock, category, thumbnail } = req.body;
    const product = new Product(null, title, description, price, thumbnail, code, stock, category);
    try{
        await productManager.saveProduct(product);
        res.json({
            status: "creado",
            product
        })
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({
            error: "Hubo un error al crear el producto",
            details: error.message
        });
    }
})
    // ejemplo para enviar desde body  
    // {
    //     "title": "Nuevo Producto1",
    //     "description": "Descripción del nuevo producto",
    //     "code": "ABC123",
    //     "price": 100,
    //     "stock": 100,
    //     "category": "Electrónicos",
    //     "thumbnails": [
    //       "ruta_imagen_1.jpg"
    //     ]
    //   }


router.put("/:pid", (req, res) => {
    const { pid } = req.params;
    const camposActualizados = req.body;
    
    productManager.updateProduct(Number(pid), camposActualizados);
    
    res.json({
        status: "actualizado",
        producto: {
            id: Number(pid),
            ...camposActualizados,
            }
        });
});
router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    if (!pid) {
        return res.json({
            status: "El id es requerido",
        });
    }
    try {
        await productManager.deleteProduct(Number(pid));
        res.json({
            message: "Producto eliminado"
        })
    } catch (e) {
        res.json({
            error: e,
        })
    }
});;
// http://localhost:8080/api/products/1

export default router;
