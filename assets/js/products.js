let contenedor = document.getElementById("contenedor");
let categoriaSelect = document.getElementById("categoriaSelect")
let materialSelect = document.getElementById("materialSelect")
let joyaSearch = document.getElementById("joyaSearch")
let materiales;
let currentMaterial;
let categorias;
let currentCategoria;
let searchName;
let listCartId = [];
let fragmento = new DocumentFragment();
let joyas = inventario_joyeria.map(joya => joya)
console.log(joyas)


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
        " w-[300px] lg:w-[200px] h-[400x] lg:h-[430px] xl:w-[300px] bg-[--crema] text-black p-4 flex flex-col justify-center items-center gap-2 rounded-xl shadow-[0px_5px_8px_5px_#CCD3CA]  hover:bg-[--amarillo] hover:shadow-[0px_6px_10px_8px_#4a5568] delay-150 relative";
    return card;
};


// interior card

let cardInterior = joya =>
    `<img class="w-[200px] h-[200px] lg:w-[150px] xl:w-[250px] object-cover rounded-md self-center border border-[--chocolate]" src="${joya.Imagen}" alt="${joya.Nombre}">
    <h3 class="font-medium text-lg">${joya.Nombre}</h3>
    <p class="text-center text-md h-[60px] ">${joya.Descripcion}</p>
    <div class=" w-3/4 flex flex-wrap justify-around items-center"><p>${joya.Precio}</p>
    <div class="bg-[--chocolate]  self-end rounded-sm px-3 py-2 font-medium"  data-joya-id="${joya.id}"><img class=w-[25px] h-[23px] cursor-pointer" src="../assets/img/cart.png" data-joya-id="${joya.id}" alt="favorite symbole"></div></div>`;








let filterName = (name, array) => array.filter(joya => joya.Nombre.toLowerCase().includes(name.trim().toLowerCase()))

//filtro categorias
let filterCategoria = (array, filter) => array.filter(joya => joya.Tipo.includes(filter))

// opciones de categorias
let optionCategoria = categoria => `<option value="${categoria}">${categoria}</option>`

categorias = [...new Set(joyas.map(joya => joya.Tipo))]

for (const categoria of categorias) {
    categoriaSelect.innerHTML += optionCategoria(categoria)
}

//filtro materiales
let filterMaterial = (array, filter) => array.filter(joya => joya.Material.includes(filter))

// opciones de materiales
let optionMaterial = material => `<option value="${material}">${material}</option>`

materiales = [...new Set(joyas.map(joya => joya.Material))]

for (const material of materiales) {
    materialSelect.innerHTML += optionMaterial(material)
}



//sincronización fuera del evento click y del fetch
let localStCart = JSON.parse(localStorage.getItem("carrito"))
if (localStCart) {
    listCartId = localStCart;
}
//  renderizar todas las movies
renderizarCards(joyas, contenedor, fragmento)

// evento de los Materials
materialSelect.addEventListener("change", () => {
    currentMaterial = materialSelect.value
    if (currentMaterial && categoriaSelect.value && joyaSearch.value) {
        renderizarCards(filterName(filterCategoria(filterMaterial(joyas, currentMaterial), categoriaSelect.value), joyaSearch.value), contenedor, fragmento)
    } else if (currentMaterial && !categoriaSelect.value && joyaSearch.value) {
        renderizarCards(filterName(filterMaterial(joyas, currentMaterial), joyaSearch.value), contenedor, fragmento)
    } else if (currentMaterial && categoriaSelect.value && !joyaSearch.value) {
        renderizarCards(filterCategoria(filterMaterial(joyas, currentMaterial), categoriaSelect.value), contenedor, fragmento)
    }
    else if (!currentMaterial && categoriaSelect.value && joyaSearch.value) {
        renderizarCards(filterName(filterCategoria(joyas, categoriaSelect.value), joyaSearch.value), contenedor, fragmento)
    }
    else if (!currentMaterial && categoriaSelect.value && !joyaSearch.value) {
        renderizarCards((filterCategoria(joyas, categoriaSelect.value)), contenedor, fragmento)
    }
    else {
        renderizarCards(filterMaterial(joyas, currentMaterial), contenedor, fragmento)
    }

    /* if (currentMaterial) {
        if (joyaSearch) {
            renderizarCards(filterName(joyaSearch.value, filterCategoria(joyas, currentMaterial)), contenedor, fragmento)
        } else {
            renderizarCards(filterCategoria = (joyas, currentMaterial), contenedor, fragmento)
        }
    } else {
        if (joyaSearch) {
            renderizarCards(filterName(joyaSearch.value, joyas), contenedor, fragmento)
        } else {
            renderizarCards(joyas, contenedor, fragmento)
        }
    } */
})

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
    if (dataSetCartId) {
        if (!listCartId.includes(dataSetCartId)) {
            listCartId.push(dataSetCartId)
        } else {
            listCartId = listCartId.filter(id => id != dataSetCartId)
        }
        localStorage.setItem("carrito", JSON.stringify(listCartId))

        if (currentCategoria) {
            searchName ? renderizarCards(filterName(searchName, filterCategoria(joyas, currentCategoria)), contenedor, fragmento) : renderizarCards(filterCategoria(joyas, currentCategoria), contenedor, fragmento)

        } else {
            searchName ? renderizarCards(filterName(searchName, joyas), contenedor, fragmento) : renderizarCards(joyas, contenedor, fragmento)

        }
    }
})


