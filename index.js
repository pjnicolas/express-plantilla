// Importamos las librerías necesarias.
const express = require('express');
const fs = require('fs');
const Mustache = require('mustache');

// Creamos la variable "app", que es la que usaremos para gestionar el servidor web de express.
const app = express();
const port = 3000;

/**
 * Leemos el fichero de "plantilla.html".
 * La plantilla internamente consta de una cabecera, un cuerpo y un pie. La cabecera y el pie van
 * directamente en el fichero "plantilla.html" pero el cuerpo se asignará dinámicamente más adelante,
 * dependiendo de a qué ruta accedamos. Esta asignación se hará con la librería "Mustache".
 */
const plantilla = String(fs.readFileSync('./public/plantilla.html'));

/**
 * Esta función es a la que se tiene que llamar dentro en cada declaración "app.get(...)" que
 * aparecen más abajo. El primer parámetro debe de ser el propio objeto "res" que proporciona
 * express, y el segundo debe ser el string, o código HTML que quieres que vaya en el cuerpo.
 *
 * Básicamente, lo que hace esta función es coger el contenido de la plantilla.html, sustituir el
 * tag "{{{cuerpo}}}" por el segundo argumento de la función (para ello usando la librería Mustache)
 * y acto seguido lo envia como respuesta HTTP. Mustache detecta automáticamente los tags con triples
 * corchetes y los traduce.
 */
function enviarPlantillaFormateada(res, cuerpoPlantilla) {
  // Aquí estamos sustituyendo el tag "{{{cuerpo}}}" por el contenido del argumento "cuerpoPlantilla".
  const plantillaFormateada = Mustache.render(plantilla, {
    cuerpo: cuerpoPlantilla,
  });

  res.send(plantillaFormateada);
}


/**
 * Aquí asignamos lo que queremos que pase en la ruta "/", es decir, la ruta raiz. En este caso,
 * se envía un string directamente.
 */
app.get('/', function (req, res) {
  enviarPlantillaFormateada(res, "<div>Esto es la página principal (/)</div>");
});


/**
 * Aquí, igual que con "/", se asigna qué queremos hacer con la ruta "/consulta". En este caso,
 * se envía un "string multilina", que es un string pero que puede ocupar varias lineas, lo que lo
 * hace muy cómodo para escribir código html. Los strings multilínea se usan con las comillas que están
 * a la derecha de la P en el teclado QWERTY (`)
 */
app.get('/consulta', function (req, res) {
  enviarPlantillaFormateada(res, `
    <div>
      Esto es un string multilinea
    </div>
    <div>
      Y se enviará cuando se acceda a <b>/consulta</b>
    </div>
  `);
});


/**
 * Esto es un ejemplo de una página que muestra un número aleatorio. Con "dólar y corchetes" se pueden
 * insertar variables dentro de un string multilinea, y así te puedes ahorrar tener que concatenar strings
 * usando el símbolo (+).
 */
app.get('/numero_aleatorio', function (req, res) {
  const aleatorio = Math.random();

  enviarPlantillaFormateada(res, `<div> El número aleatorio entre 0 y 1 es: ${aleatorio}</div>`);

  // Para que quede claro, estos dos strings son absolutamente iguales:
  // `<div> El número aleatorio entre 0 y 1 es: ${aleatorio}</div>`
  // "<div> El número aleatorio entre 0 y 1 es:" + aleatorio + "</div>"
});


/**
 * Aquí pongo un ejemplo de página que maneja parámetros GET. Para acceder a parámetos GET tienes que
 * acceder a req.query.NOMBRE_DEL_PARAMETRO.
 */
app.get('/repito_tu_nombre', function (req, res) {
  /**
   * Aquí estoy creado directamente el string con código HTML que va en esta página,
   * pero quizá lo mejor sería crear un fichero lo_que_sea.html, leer su contenido, y luego enviarlo. Incluso se podría usar
   * la librería Mustache al igual que se ha hecho en plantilla.html para cambiar cosas de ese contenido.
   */
  const inputHtml = `
    <form method="GET" action="repito_tu_nombre">
      <div>Escribe tu nombre:</div>
      <input type="text" name="nombre"/>
      <input type="submit" value="Aceptar"/>
    </form>
  `;

  // Si el nombre no es "undefined" es que se el parámetro GET "nombre" está definido.
  if (req.query.nombre !== undefined) {
    // Enviamos el formulario "inputHtml" concatenado con el texto que queremos.
    enviarPlantillaFormateada(res, `${inputHtml}<div>Tu nombre es: ${req.query.nombre}<div>`);

    // Para que quede claro, estos dos strings son absolutamente iguales:
    // `${inputHtml}<div>Tu nombre es: ${req.query.nombre}<div>`
    // inputHtml + "<div>Tu nombre es: " + req.query.nombre + "<div>"
  } else {
    enviarPlantillaFormateada(res, inputHtml + "Aún no has escrito tu nombre.");
  }

});


// Hacemos que el servidor escuche en el puerto "port". Esto debe estar siempre al final del código.
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
