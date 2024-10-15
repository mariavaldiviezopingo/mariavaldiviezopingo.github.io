    //Declaración de las APIS a consumir
    const urlProductos = "https://api.escuelajs.co/api/v1/products"
    const urlCategorias = "https://api.escuelajs.co/api/v1/categories"

    //Declaración del conjunto de productos seleccionados
    const objetosSeleccionados = [];
    let total;
    let sumaTotal = 0;
    let monto
    let textCompra = document.querySelector("#numeroCarrito");
    const shopList = document.querySelector("#contenedorProductosComprados")
    //Creación de clases
    //Clase Producto
    class Producto{
        constructor(id, name, title, img, price){
            this.id = id;
            this.name = name;
            this.title = title;
            this.img = img;
            this.price = price;
        }
    }

    //Clase UI:
    class UI{

        //método replciar producto 
        replicarProducto(producto){
            const productList = document.querySelector("#contenedorProductos")
            const element = document.createElement('div')
            element.classList.add("col-lg-4", "col-sm-6", "mb-4")
            element.innerHTML=`
            <!-- Portfolio item ${producto.id}-->
                            <div class="portfolio-item">
                                <a class="portfolio-link" data-bs-toggle="modal" href="#portfolioModal1">
                                    <div class="portfolio-hover">
                                        <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                                    </div>
                                    <img class="img-fluid" src="${producto.img}" alt="${producto.title}"/>
                                </a>
                                <div class="portfolio-caption">
                                    <div class="card-body">
                                        <h5 class="card-title portfolio-caption-heading">${producto.title}</h5>
                                        <p class="card-text portfolio-caption-subheading">${producto.price}</p>
                                        <button class="btn btn-outline-secondary boton-compra">Agregar al carro</button>
                                    </div>
                                </div>
                            </div>
            `
            productList.appendChild(element)
            this.seleccionarProducto(producto, element)
            this.actualizarCarrito()
        }

        //seleccionar producto:
        seleccionarProducto(producto, element){
            const botonCompra = element.querySelector(".boton-compra")
            botonCompra.addEventListener("click", ()=> {
                const objetoSeleccionado = {
                    id: producto.id,
                    name: producto.name,
                    title: producto.title,
                    img: producto.img,
                    price: producto.price
                }
                objetosSeleccionados.push(objetoSeleccionado)
                const vacio = document.querySelector("#carrito-vacio")
                vacio.innerHTML=""
                this.replicarCompra(objetoSeleccionado)
                const totalCompra = document.querySelector("#totaldeCompra")   
                total = objetosSeleccionados.length
                totalCompra.innerHTML=`
                        <div class="justify-content-between pie-carrito">
                        <hr class="linea"> 
                        <div class = "total">
                            <span>Total:</span>
                            <span id="montoTotal">
                            </span>
                        </div> 
                        </div>
                    `
                monto = document.querySelector("#montoTotal")

                textCompra.textContent = total
                sumaTotal = sumaTotal + producto.price
                monto.textContent = sumaTotal;
                document.querySelector("#montoPagar").textContent = "S/."+ sumaTotal + ".00";

            })
        }

        //Replicar Compra:
        replicarCompra(producto){
            const element = document.createElement("div")
            element.classList.add("miCompra", "d-flex", "justify-content-between", "border-bottom-white", "align-items-center")
            element.innerHTML=`
            <div class = "compraItem">
            
                <div class="compra-id">
                    <img src="${producto.img}" alt="${producto.id}">
                </div>
                <div class = "compraIem-descrip">
                    <div class="compra-nombre">
                        <span>${producto.title}</span>
                    </div>
                    <div class="compra-precio">
                        <span>$${producto.price}</span>
                    </div>
                </div>
                <button type="button" class="cerrarBtn btn-close" aria-label="Close"></button>
            </div> 
            `
            shopList.appendChild(element)
            this.eliminarCompra(producto, element)
            this.actualizarCarrito();
        }
        
         //Actualizar Carrito:
         actualizarCarrito(){
            if(sumaTotal === 0){
            document.getElementById("carrito-vacio").innerHTML =`
                <img src="img/carro-vacio_bebe.png" alt="">
                        <p>No hay productos en el carrito</p>
                        <button>Regresar a la tienda</button>
            ` 
            }
        }
    

        //eliminarCompra:
        eliminarCompra(producto, element){
            const botonCerrar = element.querySelector(".cerrarBtn")
            monto = document.querySelector("#montoTotal")
            botonCerrar.addEventListener("click", ()=> {
            element.remove()
            const index = objetosSeleccionados.findIndex(item => item.id === producto.id)
            if (index !== -1) {
                objetosSeleccionados.splice(index, 1)
            }
            sumaTotal = sumaTotal - producto.price
            total = objetosSeleccionados.length
            textCompra.textContent = total
            monto.textContent = sumaTotal;
            document.querySelector("#montoPagar").textContent = "S/."+ sumaTotal + ".00";
            })
        }

    }

    //Creacion de un objeto del tipo UI:
    const ui = new UI()

    //funcion fetch:
    const fetchApi = async() => {
        try{
            const response = await fetch(urlProductos)
            const data = await response.json()
            if(!response.ok){
                throw new Error("respuesta no existe")
            }
            console.log(data)
            data.forEach(i => {
                const producto = new Producto(
                    i.category.id,
                    i.category.name,
                    i.title,
                    i.images,
                    i.price
                )
                console.log(producto)
                console.log(producto)
                ui.replicarProducto(producto)
                if(sumaTotal === 0){
                    document.getElementById("carrito-vacio").innerHTML =`
                        <img src="img/carro-vacio_bebe.png" alt="">
                                <p>No hay productos en el carrito</p>
                                <button>Regresar a la tienda</button>
                    ` 
                }
            })
            
        }catch(error){
            console.log(error)
        }
    } 

    objetosSeleccionados.forEach(i => {
        const compra = new Producto(
            i.category.id,
            i.category.name,
            i.title,
            i.images,
            i.price
        )
        ui.replicarCompra(compra)
    })
    
    fetchApi();