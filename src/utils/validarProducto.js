function validarProducto(req, res, next) {
    const { title, description, price, thumbnail, code, stock, category } = req.body;

    if (!title) {
      return res.json({
        error: "Title is required",
      });
    }

    if(!description){
      return res.json({
        error: "Descripcion requerida"
      })
    }

    if(!price){
      return res.json({
        error: "El precio es requerido"
      })
    }
    if(!thumbnail){
      return res.json({
        error: "La ruta de imagen es requerida"
      })
    }
    if(!code){
      return res.json({
        error: "El codigo es requerido"
      })
    }
    if(!stock){
      return res.json({
        error: "El stock es requerido"
      })
    }
    if(!category){
      return res.json({
        error: "La categoria es requerida"
      })
    }
  
    next();
  }
  
  export { validarProducto };