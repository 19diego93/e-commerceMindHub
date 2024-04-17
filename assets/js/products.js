let contenedor = document.getElementById("contenedor");
let categoriaSelect = document.getElementById("categoriaSelect")
let joyaSearch = document.getElementById("joyaSearch")
let categorias;
let currentCategoria;
let searchName;
let listCartId = [];
let preList = [];
let fragmento = new DocumentFragment();
let joyas = inventario_joyeria.map(joya => joya)
let cantidadJoya = 0;

//sincronización fuera del evento click 
let localStCart = JSON.parse(localStorage.getItem("carrito"))
if (localStCart) {
    listCartId = localStCart;
}
let preCart = JSON.parse(localStorage.getItem("preCarrito"))
if (preCart) {
    preList = preCart;
}
//render de las cards
function renderizarCards(array, ubicacion, frag) {
    ubicacion.innerHTML = "";
    if (array.length != 0) {
        for (const joya of array) {
            frag.appendChild(cardExterior(joya));
        }
        ubicacion.appendChild(frag);
    } else { ubicacion.innerHTML = "<h4>¡No tenemos esa pieza en el inventario!</h4>" }
}

// no renderiza contiene la estructura a renderizar de las card
let cardExterior = cardData => {
    let card = document.createElement("article");
    card.innerHTML = cardInterior(cardData);
    card.className =
        " w-[310px] lg:w-[330px] h-[460px] lg:h-[520px] xl:w-[350px] bg-[--crema] text-black p-4 flex flex-col justify-center items-center gap-2 rounded-xl shadow-[0px_5px_8px_5px_#CCD3CA]  hover:bg-[--amarillo] hover:shadow-[0px_6px_10px_8px_#4a5568] delay-150 relative";
    return card;
};


// interior card

let cardInterior = joya =>
    `<img class="w-[200px] h-[200px] xl:w-[250px] object-cover rounded-md self-center border border-[--chocolate]" src="${joya.Imagen}" alt="${joya.Nombre}">
    <h3 class="font-medium text-lg">${joya.Nombre}</h3>
    <p class="text-center text-md h-[60px] ">${joya.Descripcion}</p>
    <p class="text-2xl">${joya.Precio}</p>
    <div class=" w-3/4 h-[40px] flex flex-wrap justify-around items-center">
    <div class="bg-[--chocolate] rounded-sm px-2 py-1 font-medium cursor-pointer" data-joya-id="${joya.id}"><img id="cartImg" class=w-[30px] h-[25px] cursor-pointer" src="../assets/img/cart.png" data-joya-id="${joya.id}" alt="favorite symbole"></div><p id="cantidadItem" class="text-xl">${preList.find(item => item.id == joya.id) ? preList.find(item => item.id == joya.id).cantidad : cantidadJoya}</p><div class="flex flex-col items-center"><div class="h-1/2 cursor-pointer text-[--blanco] w-[25px] px-[7px] border bg-[--chocolate]" id="sumarItem" data-joya-id="${joya.id}">+</div><div class="h-1/2 cursor-pointer text-[--blanco] w-[25px] px-[8px] border  bg-[--chocolate]" id="restarItem" data-joya-id="${joya.id}">-</div></div></div>`;






//filtro Nombres

let filterName = (name, array) => array.filter(joya => joya.Nombre.toLowerCase().includes(name.trim().toLowerCase()))

//filtro categorias
let filterCategoria = (array, filter) => array.filter(joya => joya.Tipo.includes(filter))

// opciones de categorias
let optionCategoria = categoria => `<option value="${categoria}">${categoria}</option>`

categorias = [...new Set(joyas.map(joya => joya.Tipo))]

for (const categoria of categorias) {
    categoriaSelect.innerHTML += optionCategoria(categoria)
}



//  renderizar todas las cards
renderizarCards(joyas, contenedor, fragmento)

// evento de los Materials

// evento de las Categorias
categoriaSelect.addEventListener("change", () => {
    currentCategoria = categoriaSelect.value
    if (currentCategoria) {
        if (joyaSearch) {
            renderizarCards(filterName(joyaSearch.value, filterCategoria(joyas, currentCategoria)), contenedor, fragmento)
        } else {
            renderizarCards(filterCategoria = (joyas, currentCategoria), contenedor, fragmento)
        }
    } else {
        if (joyaSearch) {
            renderizarCards(filterName(joyaSearch.value, joyas), contenedor, fragmento)
        } else {
            renderizarCards(joyas, contenedor, fragmento)
        }
    }
})
// evento del Nombre
joyaSearch.addEventListener("keyup", e => {
    searchName = e.target.value;
    if (categoriaSelect.value) {
        if (searchName) {
            renderizarCards(filterName(searchName, filterCategoria(joyas, categoriaSelect.value)), contenedor, fragmento)
        } else {
            renderizarCards(filterCategoria(joyas, categoriaSelect.value), contenedor, fragmento)
        }
    } else {
        if (searchName) {
            renderizarCards(filterName(searchName, joyas), contenedor, fragmento)
        } else {
            renderizarCards(joyas, contenedor, fragmento)
        }
    }
})

//  evento del click

contenedor.addEventListener("click", e => {

    let dataSetCartId = e.target.dataset.joyaId
    //apreta boton carrito
    if (e.target.id == "cartImg") {
        if (!listCartId.find(item => item.id == dataSetCartId) && !preList.find(item => item.id == dataSetCartId)) {
            listCartId.push({ id: dataSetCartId, cantidad: 1 })
        } else if (preList.find(item => item.id == dataSetCartId)) {
            if (listCartId.find(item => item.id == dataSetCartId)) {
                listCartId = listCartId.filter(item => item.id != dataSetCartId)
                listCartId.push(preList.find(item => item.id == dataSetCartId))
            }
            else if (preList.length > 1) {
                listCartId.push(preList.find(item => item.id == dataSetCartId))
            } else {
                preList = preList.filter(item => item.id != dataSetCartId)
            }
            localStorage.setItem("carrito", JSON.stringify(listCartId))
        }
        localStorage.setItem("preCarrito", JSON.stringify(preList))
        localStorage.setItem("carrito", JSON.stringify(listCartId))
    }
    //aprieta +
    if (e.target.id == "sumarItem") {
        if (!preList.find(item => item.id == dataSetCartId)) {
            preList.push({ id: dataSetCartId, cantidad: 1 })
        } else if (joyas.find(item => item.id == dataSetCartId).Stock > preList.find(item => item.id == dataSetCartId).cantidad) {
            preList.find(item => item.id == dataSetCartId).cantidad++;
            localStorage.setItem("preCarrito", JSON.stringify(preList))
        }
    }
    //aprieta -
    if (e.target.id == "restarItem") {
        if (preList.find(item => item.id == dataSetCartId).cantidad > 1) {
            preList.find(item => item.id == dataSetCartId).cantidad--
            localStorage.setItem("preCarrito", JSON.stringify(preList))
        } else if (preList.find(item => item.id == dataSetCartId).cantidad == 1) {
            if (preList.length > 1) {
                preList = preList.filter(item => item.id != dataSetCartId)
                listCartId = listCartId.filter(item => item.id != dataSetCartId)
            } else {
                preList = [];
                listCartId = [];
            }
            localStorage.setItem("preCarrito", JSON.stringify(preList))
            localStorage.setItem("carrito", JSON.stringify(listCartId))
        }

    }
    if (currentCategoria) {
        searchName ? renderizarCards(filterName(searchName, filterCategoria(joyas, currentCategoria)), contenedor, fragmento) : renderizarCards(filterCategoria(joyas, currentCategoria), contenedor, fragmento)

    } else {
        searchName ? renderizarCards(filterName(searchName, joyas), contenedor, fragmento) : renderizarCards(joyas, contenedor, fragmento)

    }
}
);



