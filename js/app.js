//* Constructores
function Seguro( marca, year, tipo ){
    this.marca = marca,
    this.year = year,
    this.tipo = tipo 
}


//* Realiza la cotización con los datos
Seguro.prototype.cotizarSeguro = function(){
    /**
     * 1 Americano - 1.15
     * 2 Asiatico - 1.05
     * 3 Europe - 1.35
     */

    

    let cantidad
    const base = 2000    

    switch (this.marca) {
        case '1':
            cantidad = base * 1.15
            break
        case '2':
            cantidad = base * 1.05
            break
        case '3':
            cantidad = base * 1.35
            break            
    
        default:
            break;
    }

    //Leer año seleccionado para restarle a la fecha actual
    const diferencia = new Date().getFullYear() - this.year

    // Cada año que la diferencia es mayor, el costo se va a reducir 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100

    /**
     * Si el seguro es básico se multiplica por 30% mas 
     * Si el seguro es completo se multiplica por 50% mas 
     */

    if ( this.tipo === 'basico' ){
        // A la cantidad que se tiene se multiplica por 30% mas
        cantidad *= 1.30
    } else {
        cantidad *= 1.50
    }

    return cantidad

}



function UI(){}

/**
 * Se usan arroe functions porque no se utiliza ninguna propiedad con this del objeto
 */
// llena las opciones de los años 
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear()
    const min = max - 20

    const selectYear = document.querySelector('#year')

    // Retrocediendo para mostrar el año mayor al principio
    for (let i = max; i > min; i--) {
        let option = document.createElement('option')
        option.value = i
        option.textContent = i
        
        // Agregando al selector
        selectYear.appendChild(option)
    }
}


//* Muestra alertas en pantalla
UI.prototype.mostrarMensaje = ( mensaje, tipo ) => {
    const div = document.createElement('div')

    if ( tipo === 'error' ){
        div.classList.add('error')
    } else {
        div.classList.add('correcto')
    }

    div.classList.add('mensaje', 'mt-10')
    div.textContent = mensaje

    // Insertar en el HTML 
    const formulario = document.querySelector('#cotizar-seguro') 
    // Insertandolo antes del id resultado
    formulario.insertBefore(div, document.querySelector('#resultado'))

    // Eliminado el mensaje de error después de 3 seg
    setTimeout(() => {
        div.remove()
    }, 3000);

}


UI.prototype.mostrarResultado = ( total, seguro ) => {
    
    const { marca, year, tipo } = seguro 
    let txtMarca 

    switch (marca) {
        case '1': txtMarca = 'Americano'        
            break;
        case '2': txtMarca = 'Asiatico'        
            break;
        case '3': txtMarca = 'Europeo'        
            break;
    
        default:
            break;
    }

    // Crear resultado 
    const div = document.createElement('div')
    div.classList.add('mt-10')
    div.innerHTML = `
        <p class ="header">Tu resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${ txtMarca } </span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${ tipo } </span></p>
        <p class="font-bold">Año: <span class="font-normal"> ${ year } </span></p>
        <p class="font-bold">Total: <span class="font-normal"> $ ${ total } </span></p>
    `   

    // Agregando los resultados al div 
    const resultadoDiv = document.querySelector('#resultado')
    
    // Mostrar spinner 
    const spinner = document.querySelector('#cargando')
    spinner.style.display = 'block'
    
    
    // Desaparecer spinner y mostrando resultados 
    setTimeout(() => {
        spinner.style.display = 'none'
        resultadoDiv.appendChild(div) 
    }, 3000);

}



//* Instanciar UI
const ui = new UI()


document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones() // Llena select con los años
})


eventListeners()

function eventListeners(){
    const formulario = document.querySelector('#cotizar-seguro')
    formulario.addEventListener('submit', cotizarSeguro)
}

function cotizarSeguro(e){
    e.preventDefault()

    // Leer marca seleccionada
    const marca = document.querySelector('#marca').value
    
    //Leer año seleccionado 
    const year = document.querySelector('#year').value
    

    // Leer tipo de cobertura - radio button
    const tipo = document.querySelector('input[name="tipo"]:checked').value

    if ( marca === "" || year === "" || tipo === "" ){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error')
        return 
    }

    ui.mostrarMensaje('Cotizando...', 'exito')

    // Eliminar cotizaciones previas 
    const resultados = document.querySelector('#resultado div')

    if (  resultados != null ){
        resultados.remove()
    }


    // Instanciar seguro 
    const seguro = new Seguro(marca, year, tipo)
    const total = seguro.cotizarSeguro()

    // Utilizar el prototype que va a cotizar  
    ui.mostrarResultado(total, seguro)
}