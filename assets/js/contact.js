let form = document.getElementById("formulario")
let consultas = [];
let sTcon=[];
if (JSON.parse(sessionStorage.getItem("consultas"))) {
    consultas.push(JSON.parse(sessionStorage.getItem("consultas")))
}
form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("evento");
    let nombreC = e.target[0].value
    let emailC = e.target[1].value
    let asuntoC = e.target[2].value
    let mensajeC = e.target[3].value
    if (nombreC && emailC && asuntoC && mensajeC) {
        if (JSON.parse(sessionStorage.getItem("consultas"))) {
            consultas.push(JSON.parse(sessionStorage.getItem("consultas")))
        }
        console.log(consultas)
        alert(`Gracias por su mensaje ${nombreC}, a la brevedad estaremos en contacto`)
        consultas.push({
            nombre: nombreC,
            email: emailC,
            asunto: asuntoC,
            mensaje: mensajeC,
        })
        console.log(consultas)

        sessionStorage.setItem("consultas", JSON.stringify(consultas))
        form.reset()
    }
})