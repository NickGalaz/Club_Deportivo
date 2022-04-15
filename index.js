// MODULOS
const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 3000;


// SERVIDOR
http
    .createServer((req, res) => {

        // RUTA RAÍZ PARA DISPONIBILIZAR index.html
        if (req.url == ('/')) {
            res.writeHead(200, { 'Content-Type': 'text:html' });
            fs.readFile('index.html', (err, html) => {
                res.end(html);
            })
        }

        // Query strings desde la url
        const { nombre, precio } = url.parse(req.url, true).query;

        // Objeto que se guarda
        let deporte = {
            nombre,
            precio
        }

        // Ruta para agregar nuevos registros al archivo deportes.json
        if (req.url.startsWith('/agregar')) {

            let data = JSON.parse(fs.readFileSync('./archivos/deportes.json'));

            let deportes = data.deportes;

            deportes.push(deporte);

            fs.writeFileSync('./archivos/deportes.json', JSON.stringify(data));
            res.writeHead(201).end("Deporte creado!");
        }


        // Ruta para disponibilizar los datos desde archivo deportes.json
        if (req.url.includes('/deportes')) {
            fs.readFile('./archivos/deportes.json', (err, data) => {
                res.write(data);
                res.end();
            })
        }

        // Ruta para actualizar registros del archivo deportes.json
        if (req.url.startsWith('/editar')) {

            let data = JSON.parse(fs.readFileSync('./archivos/deportes.json'));

            let deportes = data.deportes;

            deportes.map((d) => {
                if (d.nombre == nombre) {
                    d.precio = precio
                }
                else {
                    return d;
                }
            })

            fs.writeFileSync('./archivos/deportes.json', JSON.stringify(data));
            res.writeHead(201).end("Deporte actualizada!!");
        }

        // Ruta para borrar registros del archivo deportes.json
        if (req.url.startsWith('/eliminar')) {

            let data = JSON.parse(fs.readFileSync('./archivos/deportes.json'));

            let deportes = data.deportes;

            data.deportes = deportes.filter((d) => {
                return d.nombre !== nombre;
            })

            fs.writeFileSync('./archivos/deportes.json', JSON.stringify(data));
            res.writeHead(200).end("Deporte borrado!!");
        } 
    })
    .listen(port, () => console.log('Servidor corriendo en puerto:', port))