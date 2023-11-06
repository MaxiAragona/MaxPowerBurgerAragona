//
// Base de datos estatica de hamburguesa
//
const hamburguesas = [
    {   
        id: 1,
        titulo: "AMERICAN DOBLE",
        descripcion: "Medallon x2 Cheddar Fetas x4 Tomate Lechuga Cebolla y Thousand Island.",
        imagen: "img/american-doble.jpeg",
        precio: 4550,
    },
    {   
        id: 2,
        titulo: "MAX POWER",
        descripcion: "Medallon x2 Cheddar Fetas x4 Bacon Cebolla Crispy salsa power doble.",
        imagen: "img/maxpower.jpeg",
        precio: 4800,
    },
    {   
        id: 3,
        titulo: "ONION",
        descripcion: "Medallon x2 Cheddar x4 Cebolla Grilled en pan de papa con salsa po",
        imagen: "img/onion.jpeg",
        precio: 4400,
    },
    {   
        id: 4,
        titulo: "CALIFORNIANA",
        descripcion: "Medallón, cheddar x2, lechuga, tomate, cebolla, salsa picante en pan brioche.",
        imagen: "img/american-simple.jpeg",
        precio: 4000,
    },
    {   
        id: 5,
        titulo: "ROYAL POWER",
        descripcion: "Medallon x2 Cheddar Fetas x4 Cebolla Ketchup mayonesa en pan de papa.",
        imagen: "img/royal.jpeg",
        precio: 4300,
    },
    {   
        id: 6,
        titulo: "TRIPLE CHEES",
        descripcion: "Medallon x3 Cheddar Fetas x6 en un pan brioche con papas fritas y salsa power.",
        imagen: "img/triplecheese.jpeg",
        precio: 5000,
    },
];

//
// funciones para el manejo del carrito
//
const obtenerCarrito = () => {
    let carrito = localStorage.getItem("carrito");
    if (carrito) {
        carrito = JSON.parse(carrito);
    }
    return carrito || [];
}

const guardarCarrito = (carrito) => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizar();
}

const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    actualizar();
}

const agregarAlCarrito = (id) => {
    //buscamos la hamburguesa en nuestra base de hamburguesa
    const hamburguesa = hamburguesas.find(h => h.id == id);

    if (hamburguesa) {
        const carrito = obtenerCarrito();
        //verificamos si ya existe la hamburguesa en el carrito
        const hamburguesaEnCarrito = carrito.find(h => h.id == id);

        if (!hamburguesaEnCarrito) {
            //como no existe la hamburguesa en el carrito , la agregamos.
            carrito.push({
                id,
                hamburguesa,
                cantidad: 1
            });

        } else {
            //la hamburguesa ya existe en el carrito tenemos que modificar la cantidad.
            hamburguesaEnCarrito.cantidad += 1;
        }

        guardarCarrito(carrito);

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "hamburguesa agregada correctamente",
            showConfirmButton: false,
            timer: 1500
        });
    }
}

const eliminarDelCarrito = (id) => {
    //buscamos la hamburguesa en nuestra base de hamburguesa
    const hamburguesa = hamburguesas.find(h => h.id == id);

    if (hamburguesa) {
        const carrito = obtenerCarrito();
        //filtramos del carrito las hamburguesas que no quiero eliminar
        const carritoFiltrado = carrito.filter(h => h.id != id);

        guardarCarrito(carritoFiltrado);
        Swal.close();
        verCarrito();
    }
}

const verCarrito = () => {
    const carrito = obtenerCarrito();

    if (!carrito.length) {
        return Swal.fire({
            title: "todavia no agregaste ninguna hamburguesa",
            showCloseButton: false,
            focusConfirm: true,
            confirmButtonText: "aceptar",
          });
    }

    const html = carrito
        .map(item => {
            return `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <img src="${item.hamburguesa.imagen}" alt="foto" width="40px" height="40px" class="me-3">
                        <span class="me-3">${item.hamburguesa.titulo} x ${item.cantidad} uni.</span>
                    </div>
                    <div class="d-flex justify-content-center align-items-center">
                        <span class="me-3">$ ${item.hamburguesa.precio * item.cantidad}</span>
                        <a href="#" onclick="eliminarDelCarrito(${item.id})">🗑️</a>
                    </div>
                </div>
            `;
        })
        .join("\n");

    Swal.fire({
        title: "<strong>Carrito</strong>",
        html: `
            ${html}
            <div class="d-flex justify-content-end align-items-center mt-3">
               <b> total $ ${carrito.reduce((a, h) => a + (h.hamburguesa.precio* h.cantidad), 0)} </b>
            </div>
            <div class="d-flex justify-content-center align-items-center mt-3">
                <a href="#" onclick="vaciarCarrito(); Swal.close()">vaciar carrito</a>
            </div>
        `,
        showCloseButton: false,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "ir a pagar",
        cancelButtonText: "continuar comprando",
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Felicitaciones! compra realizada correctamente", "", "success");
            vaciarCarrito();
        }
      });
}

const actualizar = () => {
    const cantidadEnCarrito = document.getElementById("cantidadEnCarrito");
    const cantidadDeHamburguesasEnCarrito = document.getElementById("cantidadDeHamburguesasEnCarrito");
    const carrito = obtenerCarrito();

    if (!carrito.length) {
        //si no hay elementos en el carrito ocultamos el indicador de cantidad
        cantidadEnCarrito.classList.remove("d-inline");
        cantidadEnCarrito.classList.add("d-none");
        cantidadDeHamburguesasEnCarrito.innerHTML = "0"
    } else {
        //si hay elementos mostramos y actualizamos el indicador de cantidad
        cantidadEnCarrito.classList.add("d-inline");
        cantidadEnCarrito.classList.remove("d-none");
        cantidadDeHamburguesasEnCarrito.innerHTML = `${carrito.reduce((a, h) => a + h.cantidad, 0)}`;
    }
}

//iniciando el script
window.addEventListener('load', () => {
    actualizar();
});



