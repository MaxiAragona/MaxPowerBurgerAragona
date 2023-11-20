let hamburguesas = [];

// Función para obtener de forma asíncrona los datos de hamburguesas desde JSON
const obtenerHamburguesasDesdeJSON = async () => {
    try {
        const respuesta = await fetch("data.json");
        const datos = await respuesta.json();
        hamburguesas = datos; 
        dibujarHamburguesas();
        actualizar();
    } catch (error) {
        console.error('Error al obtener datos de hamburguesas:', error);
    }
};

// Funciones para el manejo del carrito
const obtenerCarrito = () => {
    let carrito = localStorage.getItem("carrito");
    if (carrito) {
        carrito = JSON.parse(carrito);
    }
    return carrito || [];
};

const guardarCarrito = (carrito) => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizar();
};

const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    actualizar();
};

const agregarAlCarrito = (id) => {
    const hamburguesa = hamburguesas.find(h => h.id == id);

    if (hamburguesa) {
        const carrito = obtenerCarrito();
        const hamburguesaEnCarrito = carrito.find(h => h.id == id);

        if (!hamburguesaEnCarrito) {
            carrito.push({
                id,
                hamburguesa,
                cantidad: 1
            });

        } else {
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
};

const eliminarDelCarrito = (id) => {
    const hamburguesa = hamburguesas.find(h => h.id == id);

    if (hamburguesa) {
        const carrito = obtenerCarrito();
        const carritoFiltrado = carrito.filter(h => h.id != id);

        guardarCarrito(carritoFiltrado);
        Swal.close();
        verCarrito();
    }
};

const verCarrito = () => {
    const carrito = obtenerCarrito();

    if (!carrito.length) {
        return Swal.fire({
            title: "todavía no agregaste ninguna hamburguesa",
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
               <b> total $ ${carrito.reduce((a, h) => a + (h.hamburguesa.precio * h.cantidad), 0)} </b>
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
            Swal.fire("¡Felicitaciones! Compra realizada correctamente", "", "success");
            vaciarCarrito();
        }
    });
};

const actualizar = () => {
    const cantidadEnCarrito = document.getElementById("cantidadEnCarrito");
    const cantidadDeHamburguesasEnCarrito = document.getElementById("cantidadDeHamburguesasEnCarrito");
    const carrito = obtenerCarrito();

    if (!carrito.length) {
        cantidadEnCarrito.classList.remove("d-inline");
        cantidadEnCarrito.classList.add("d-none");
        cantidadDeHamburguesasEnCarrito.innerHTML = "0";
    } else {
        cantidadEnCarrito.classList.add("d-inline");
        cantidadEnCarrito.classList.remove("d-none");
        cantidadDeHamburguesasEnCarrito.innerHTML = `${carrito.reduce((a, h) => a + h.cantidad, 0)}`;
    }
};

const dibujarHamburguesas = () => {
    const contenedorDeHamburguesas = document.getElementById("contenedorDeHamburguesas");

    hamburguesas.forEach(hamburguesa => {
        // Appendeamos las hamburguesas en el elemento contenedor
        contenedorDeHamburguesas.innerHTML += `
            <article data-aos="flip-left" class="col">
                <div class="card shadow-sm ">
                    <img src="${hamburguesa.imagen}" alt="foto american doble">
                    <div class="card-body containerFondo">
                        <h3 class="text-center subTitulos">${hamburguesa.titulo}</h3>
                        <p class="card-text">${hamburguesa.descripcion}</p>
                        <h5 class="card-text"><b>$ ${hamburguesa.precio}</b></h5>
                        <div class="d-flex justify-content-center align-items-center">
                            <button onclick="agregarAlCarrito(${hamburguesa.id})" class="btnAgregar btn btn-dark text-uppercase">agregar al carrito</button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    });

};

// Llama a la función para obtener los datos de hamburguesas cuando la ventana carga
window.addEventListener('load', () => {
    obtenerHamburguesasDesdeJSON();
});