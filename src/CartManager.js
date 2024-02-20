import fs from "fs"

class CartManager{
    constructor(path){
        this.path = path;
    try {
        let carts = fs.readFileSync(this.path, "utf-8");
        this.carts = JSON.parse(carts);
    } catch (error) {
        if (error.code === 'ENOENT') {
            fs.writeFileSync(this.path, '[]');
            this.carts = [];
        } else {
            console.error("Error al leer el archivo JSON:", error);
            this.carts = [];
        }
    }
    }
    async getCarts(){
        return this.carts
    }

    async saveCarts(cart) {
        if (!cart) {
            return console.log("No hay Carrito", this.carts);
        }
    
        const cartExist = this.carts.find((c) => c.id === cart.id);
        if (cartExist) {
            console.log("El carrito ya existe");
            throw Error(`Carrito con el id ${cart.id} ya existe`);
        }
    
        cart.id = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
    
        const cleanCart = {
            id: cart.id,
            products: cart.products,
            quantity: cart.quantity,
        };
    
        try {
            this.carts.push(cleanCart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, "\t"));
        } catch (error) {
            console.log(`Hubo un error al guardar el carrito: ${error}`);
            throw Error("Hubo un error al crear el carrito: " + error);
        }
    }
    async getCartById(id){
        const carts =  await this.getCarts();
        const cart = carts.find((cart) => cart.id === id);
        if(!cart) {
            console.log("El carrito no fue encontrado :( ")
        }
        return cart;
    }
    async addProductInCart(cid, pid){
        const cartToModify = this.getCartById(cid);

        if (cartToModify) {
        cartToModify.products.push({product: pid, quantity: 1});
        this.saveCarts();
        } else {
        console.log("No se encontró el carrito");
        }
    }
}

class Cart{
    constructor(products, quantity){
        this.products = products;
        this.quantity = quantity;
    }
}


export { CartManager, Cart }