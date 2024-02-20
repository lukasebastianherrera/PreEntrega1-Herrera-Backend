import fs from 'fs'
class ProductManager {
    constructor(path) {
    this.path = path;
    try {
        let products = fs.readFileSync(this.path, "utf-8");
        this.products = JSON.parse(products);
    } catch (error) {
        if (error.code === 'ENOENT') {
            fs.writeFileSync(this.path, '[]');
            this.products = [];
        } else {
            console.error("Error al leer el archivo JSON:", error);
            this.products = [];
        }
    }
    }

    getProducts(){
        return this.products
    }
    async saveProduct(product) {
        if (!product) {
        return console.log("No hay producto", this.products);
        }
    
        const productoExistente = this.products.find((p) => p.id === product.id);
        const productCodeRepetido = this.products.some((p) => p.code === product.code);
        if (productCodeRepetido) {
        console.log(`EL CAMPO DE  ${code} SE REPITE `);
        return;
        }
    
        if (productoExistente) {
        console.log("El producto ya existe");
        throw Error(`Producto con el id ${product.id} ya existe`);
        }
        product.id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
        try {
        this.products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t")
        );
        } catch (error) {
        console.log(`Hubo un error al guardar el producto: ${error}`);
        throw Error("Hubo un error al crear el producto: " + error);
        }
        
    } 
    getProductById(id) {
        const products = this.getProducts();
        const product = products.find((product) => product.id === id);
    if (!product) {
        console.log(`El producto con el id: ${id} no fue encontrado`);
    }
    return product;
    }

    updateProduct(id, camposActualizados) {
        const products = this.getProducts();
        const index = products.findIndex((product) => product.id === id);
    
        if (index !== -1) {
            camposActualizados.id = id;
            Object.keys(camposActualizados).forEach((field) => {
                if (field !== 'id') {
                    products[index][field] = camposActualizados[field];
                }
            });
            try {
                fs.writeFileSync(this.path, JSON.stringify(products, null, "\t"));
                console.log(`El producto ${id} se actualizó correctamente`);
            } catch (error) {
                console.log(`Hubo un error al guardar los datos: ${error}`);
            }
        } else {
            console.log(`El producto ${id} no se encontró para actualizar`);
        }
    }

    async deleteProduct(id) {
        const product = this.products.find((p) => p.id === id);
    
        if (!product) {
            console.log("El producto no existe");
            throw Error("El producto no existe");
        }
    
        const index = this.products.findIndex((p) => p.id === id);
    
        try {
            this.products.splice(index, 1);
            await fs.promises.writeFile(
            this.path,
            JSON.stringify(this.products, null, "\t")
        );
        } catch (error) {
            console.log(`Hubo un error al guardar los datos: ${error}`);
            return;
        }
    }
}

class Product {
    constructor(title, description,  price, thumbnail, code, stock, category){
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.thumbnail = thumbnail;
    }
}

export { ProductManager, Product };
