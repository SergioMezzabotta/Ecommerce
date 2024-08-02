const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const port = 8080;
const async = require('async');
const fs = require('fs')
const fse = require('fs-extra')
require('dotenv').config();
const config = require('./config');

const directorioActual = __dirname;

app.use(bodyParser.urlencoded(config.bodyParserConfig));
app.use(bodyParser.json());
//configuraciones de CORS
app.use(cors(config.corsConfig));

//conexion con la base de datos
const db = mysql.createPool(config.dbConfig);


// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_- //
//guardar carpetas seleccionadas en la base de datos
app.post('/guardar-carpetas', async (req, res) => {
  try {
    const { carpetasSeleccionadas, classifierData } = req.body;

    if (!carpetasSeleccionadas || !Array.isArray(carpetasSeleccionadas) || !classifierData) {
      return res.status(400).json({ error: 'Datos no válidos' });
    }

    const [carpetasEnBD] = await db.promise().query('SELECT IdFolder FROM selected_folders');

    const carpetasParaEliminar = carpetasEnBD.map(carpeta => carpeta.IdFolder).filter(id => !carpetasSeleccionadas.some(c => c.IdFolder === id));

    await Promise.all(carpetasParaEliminar.map(async (idFolder) => {
      await db.promise().query('DELETE FROM selected_folders WHERE IdFolder = ?', [idFolder]);
    }));

    await Promise.all(carpetasSeleccionadas.map(async (carpeta) => {
      await db.promise().query(
        'INSERT INTO selected_folders (IdFolder, Name, IdParent) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Name = VALUES(Name), IdParent = VALUES(IdParent)',
        [carpeta.IdFolder, carpeta.Name, carpeta.IdParent]
      );
    }));

    res.json({ message: 'Carpetas seleccionadas guardadas con éxito' });
  } catch (error) {
    console.error('Error al guardar carpetas seleccionadas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//get a las carpetas seleccionadas
app.get('/obtener-carpetas-seleccionadas', async (req, res) => {
  try {
    const [carpetasSeleccionadas] = await db.promise().query('SELECT * FROM selected_folders');
    res.json(carpetasSeleccionadas);
  } catch (error) {
    console.error('Error al obtener carpetas seleccionadas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//borrar las carpetas deseleccionadas
app.delete('/eliminar-carpeta/:idFolder', async (req, res) => {
  try {
    const idFolder = req.params.idFolder;
    await db.promise().query('DELETE FROM selected_folders WHERE IdFolder = ?', [idFolder]);
    res.json({ message: 'Carpeta eliminada de la base de datos con éxito' });
  } catch (error) {
    console.error('Error al eliminar carpeta de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// hacer un app.delete todo, que borre todas las carpetas seleccionadas
app.delete('/eliminar-datos-selectedfolders', async (req, res) => {
  try {
    db.query('DELETE FROM selected_folders');
    res.json({ message: 'Carpetas eliminadas de la base de datos' });
  } catch (error) {
    console.error('Error al eliminar las carpetas de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_- //
//guardar carpetas del navbar seleccionadas en la base de datos
app.post('/guardar-carpetasnavbar', async (req, res) => {
  try {
    const { carpetasSeleccionadas, classifierData } = req.body;

    if (!carpetasSeleccionadas || !Array.isArray(carpetasSeleccionadas) || !classifierData) {
      return res.status(400).json({ error: 'Datos no válidos' });
    }

    const [carpetasEnBD] = await db.promise().query('SELECT IdFolder FROM navbar_selected_folders');

    const carpetasParaEliminar = carpetasEnBD.map(carpeta => carpeta.IdFolder).filter(id => !carpetasSeleccionadas.some(c => c.IdFolder === id));

    await Promise.all(carpetasParaEliminar.map(async (idFolder) => {
      await db.promise().query('DELETE FROM navbar_selected_folders WHERE IdFolder = ?', [idFolder]);
    }));

    await Promise.all(carpetasSeleccionadas.map(async (carpeta) => {
      await db.promise().query(
        'INSERT INTO navbar_selected_folders (IdFolder, Name, IdParent) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Name = VALUES(Name), IdParent = VALUES(IdParent)',
        [carpeta.IdFolder, carpeta.Name, carpeta.IdParent]
      );
    }));

    res.json({ message: 'Carpetas seleccionadas guardadas con éxito' });
  } catch (error) {
    console.error('Error al guardar carpetas seleccionadas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//get a las carpetas del navbar seleccionadas
app.get('/obtener-carpetasnavbar-seleccionadas', async (req, res) => {
  try {
    const [carpetasSeleccionadas] = await db.promise().query('SELECT * FROM navbar_selected_folders');
    res.json(carpetasSeleccionadas);
  } catch (error) {
    console.error('Error al obtener carpetas seleccionadas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//borrar las carpetas del navbar deseleccionadas
app.delete('/eliminar-carpetanavbar/:idFolder', async (req, res) => {
  try {
    const idFolder = req.params.idFolder;
    await db.promise().query('DELETE FROM navbar_selected_folders WHERE IdFolder = ?', [idFolder]);
    res.json({ message: 'Carpeta eliminada de la base de datos con éxito' });
  } catch (error) {
    console.error('Error al eliminar carpeta de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// hacer un app.delete todo, que  todas las carpetas del navbar seleccionadas
app.delete('/eliminar-datos-navbarfolders', async (req, res) => {
  try {
    db.query('DELETE FROM navbar_selected_folders');
    res.json({ message: 'Carpetas eliminadas de la base de datos' });
  } catch (error) {
    console.error('Error al eliminar las carpetas de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_- //
//guardar carpetas RECOMENDADAS seleccionadas en la base de datos
app.post('/guardar-carpetasrecomendadas', async (req, res) => {
  try {
    const { carpetasSeleccionadas, classifierData } = req.body;

    if (!carpetasSeleccionadas || !Array.isArray(carpetasSeleccionadas) || !classifierData) {
      return res.status(400).json({ error: 'Datos no válidos' });
    }

    const [carpetasEnBD] = await db.promise().query('SELECT IdFolder FROM recomended_categories');

    const carpetasParaEliminar = carpetasEnBD.map(carpeta => carpeta.IdFolder).filter(id => !carpetasSeleccionadas.some(c => c.IdFolder === id));

    await Promise.all(carpetasParaEliminar.map(async (idFolder) => {
      await db.promise().query('DELETE FROM recomended_categories WHERE IdFolder = ?', [idFolder]);
    }));

    await Promise.all(carpetasSeleccionadas.map(async (carpeta) => {
      await db.promise().query(
        'INSERT INTO recomended_categories (IdFolder, Name, IdParent) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Name = VALUES(Name), IdParent = VALUES(IdParent)',
        [carpeta.IdFolder, carpeta.Name, carpeta.IdParent]
      );
    }));

    res.json({ message: 'Carpetas seleccionadas guardadas con éxito' });
  } catch (error) {
    console.error('Error al guardar carpetas seleccionadas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//get a las carpetas RECOMENDADAS seleccionadas
app.get('/obtener-carpetasrecomendadas', async (req, res) => {
  try {
    const [carpetasSeleccionadas] = await db.promise().query('SELECT * FROM recomended_categories');
    res.json(carpetasSeleccionadas);
  } catch (error) {
    console.error('Error al obtener carpetas seleccionadas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//borrar las carpetas RECOMENDADAS deseleccionadas
app.delete('/eliminar-carpetacarpetasrecomendadas/:idFolder', async (req, res) => {
  try {
    const idFolder = req.params.idFolder;
    await db.promise().query('DELETE FROM recomended_categories WHERE IdFolder = ?', [idFolder]);
    res.json({ message: 'Carpeta eliminada de la base de datos con éxito' });
  } catch (error) {
    console.error('Error al eliminar carpeta de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// hacer un app.delete todo, que borre todas las carpetas recomendadas
app.delete('/eliminar-datos-carpetasrecomendadas', async (req, res) => {
  try {
    db.query('DELETE FROM recomended_categories');
    res.json({ message: 'Carpetas eliminadas de la base de datos' });
  } catch (error) {
    console.error('Error al eliminar las carpetas de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_- //
//guardar carpetas EXCLUIDAS en la base de datos
app.post('/guardar-carpetasexcluidas', async (req, res) => {
  try {
    const { carpetasSeleccionadas, classifierData } = req.body;

    if (!carpetasSeleccionadas || !Array.isArray(carpetasSeleccionadas) || !classifierData) {
      return res.status(400).json({ error: 'Datos no válidos' });
    }

    const [carpetasEnBD] = await db.promise().query('SELECT IdFolder FROM excluded_folders');

    const carpetasParaEliminar = carpetasEnBD.map(carpeta => carpeta.IdFolder).filter(id => !carpetasSeleccionadas.some(c => c.IdFolder === id));

    await Promise.all(carpetasParaEliminar.map(async (idFolder) => {
      await db.promise().query('DELETE FROM excluded_folders WHERE IdFolder = ?', [idFolder]);
    }));

    await Promise.all(carpetasSeleccionadas.map(async (carpeta) => {
      await db.promise().query(
        'INSERT INTO excluded_folders (IdFolder, Name, IdParent) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Name = VALUES(Name), IdParent = VALUES(IdParent)',
        [carpeta.IdFolder, carpeta.Name, carpeta.IdParent]
      );
    }));

    res.json({ message: 'Carpetas excluidas guardadas con éxito' });
  } catch (error) {
    console.error('Error al guardar carpetas excluidas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//get a las carpetas EXCLUIDAS
app.get('/obtener-carpetasexcluidas', async (req, res) => {
  try {
    const [carpetasSeleccionadas] = await db.promise().query('SELECT * FROM excluded_folders');
    res.json(carpetasSeleccionadas);
  } catch (error) {
    console.error('Error al obtener carpetas seleccionadas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//borrar las carpetas EXCLUIDAS
app.delete('/eliminar-carpetasexcluidas/:idFolder', async (req, res) => {
  try {
    const idFolder = req.params.idFolder;
    await db.promise().query('DELETE FROM excluded_folders WHERE IdFolder = ?', [idFolder]);
    res.json({ message: 'Carpeta eliminada de la base de datos con éxito' });
  } catch (error) {
    console.error('Error al eliminar carpeta de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// hacer un app.delete todo, que borre todas las carpetas excluidas
app.delete('/eliminar-datos-carpetasexcluidas', async (req, res) => {
  try {
    db.query('DELETE FROM excluded_folders');
    res.json({ message: 'Carpetas eliminadas de la base de datos' });
  } catch (error) {
    console.error('Error al eliminar las carpetas de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



// borrar todas las ordenes de pedido
app.delete('/eliminar-datos-ordenes', async (req, res) => {
  try {
    db.query('DELETE FROM orders');
    res.json({ message: 'Pedidos eliminados de la base de datos' });
  } catch (error) {
    console.error('Error al eliminar los pedidos de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//borrar todos los datos de imagenes en la base de datos
app.delete('/eliminar-datos-imgcontroller', async (req, res) => {
  try {
    db.query('DELETE FROM imgcontroller');
    res.json({ message: 'Carpetas eliminadas de la base de datos' });
  } catch (error) {
    console.error('Error al eliminar las carpetas de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//multer para imagen del avatar
const Avatarcontainer = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(directorioActual, 'src/media'));
  },
  filename: function (req, file, cb) {
    const imgname = req.params.imgname;
    const extension = '.png';
    const nombreArchivo = imgname + extension;
    cb(null, nombreArchivo);
  },
});

const subirAvatar = multer({ storage: Avatarcontainer });

app.post('/subir-avatar/:imgname', subirAvatar.single('image'), (req, res) => {
  res.json({ message: 'Avatar subido con éxito.' });
});

//imagenes del banner
const folderPath = path.join(directorioActual, 'public/banner_img');

app.get('/rutas-img', (req, res) => {
  try {
    const imageFiles = fs.readdirSync(folderPath);
    const imagePaths = imageFiles.map(file => file);
    res.json({ imagePaths });
  } catch (error) {
    console.error('Error reading image paths:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//multer para imagenes del banner
const almacen = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const subir = multer({ storage: almacen });

app.post('/subir', subir.array('images'), (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  } else if (!req.files) {
    return res.status(400).json({ error: 'No se subieron archivos' });
  } else if (req.files.length === 0) {
    return res.status(400).json({ error: 'Archivo no válido' });
  }
});

//borrar imagenes del banner
app.delete('/eliminar-img/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(directorioActual, 'public/banner_img', filename);

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Error deleting image:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Imagen eliminada correctamente' });
    }
  });
});

//multer para imagenes de categorias
const imgCategoryAlmacen = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(directorioActual, 'public/category'));
  },
  filename: function (req, file, cb) {
    const IdFolder = req.params.IdFolder;
    const extension = '.png';
    const nombreArchivo = IdFolder + extension;
    cb(null, nombreArchivo);
  },
});

const subirImagenesCategorias = multer({ storage: imgCategoryAlmacen });

app.post('/subir-imagen/:IdFolder', subirImagenesCategorias.single('image'), (req, res) => {
  res.json({ message: 'Imagen subida con éxito.' });
});

//borrar imagenes de categorias
app.delete('/eliminar-imagen/:IdFolder', (req, res) => {
  try {
    const IdFolder = req.params.IdFolder;
    const imagePath = path.join(directorioActual, 'public/category', IdFolder + '.png');

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      res.json({ message: 'Imagen eliminada con éxito.' });
    } else {
      res.status(404).json({ message: 'La imagen no existe.' });
    }
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    res.status(500).json({ message: 'Error al eliminar la imagen.' });
  }
});

//multer para imagen de logo de la pagina
const logocontainer = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(directorioActual, 'src/media'));
  },
  filename: function (req, file, cb) {
    const imgname = req.params.imgname;
    const extension = '.png';
    const nombreArchivo = imgname + extension;
    cb(null, nombreArchivo);
  },
});

const subirLogo = multer({ storage: logocontainer });

app.post('/subir-logo/:imgname', subirLogo.single('image'), (req, res) => {
  res.json({ message: 'Imagen subida con éxito.' });
});

//multer para icono de la pagina
const iconocontainer = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(directorioActual, 'public'));
  },
  filename: function (req, file, cb) {
    const imgname = req.params.imgname;
    const extension = '.ico';
    const nombreArchivo = imgname + extension;
    cb(null, nombreArchivo);
  },
});

const subirIcono = multer({ storage: iconocontainer });

app.post('/subir-icon/:imgname', subirIcono.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha enviado ningún archivo.' });
    }

    res.json({ message: 'Imagen subida con éxito.' });
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    res.status(500).json({ error: 'Error al subir la imagen.' });
  }
});

//genera un par de claves RSA
// const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//   modulusLength: 2048,
//   publicKeyEncoding: { type: 'spki', format: 'pem' },
//   privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
// });

function encryptData(data) {
  try {
    if (data === null) {
      return null;
    }

    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    const encryptedData = crypto.publicEncrypt({
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    }, Buffer.from(data)).toString('base64');

    return encryptedData;
  } catch (error) {
    console.error('Error durante el cifrado:', error);
    throw error;
  }
}

function decryptData(encryptedData) {
  try {
    if (encryptedData === null) {
      return null;
    }

    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

    const decryptedData = crypto.privateDecrypt({
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    }, Buffer.from(encryptedData, 'base64')).toString('utf8');

    return decryptedData;
  } catch (error) {
    console.error('Error durante el descifrado:', error);
    throw error;
  }
}

//rutas a las claves
const publicKeyPath = 'src/components/Keys/public-key.pem';
const privateKeyPath = 'src/components/Keys/private-key.pem';
// guardar las claves en archivos
// fs.writeFileSync(publicKeyPath, publicKey);
// fs.writeFileSync(privateKeyPath, privateKey);

// registro
app.post('/signup', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin || 0;

  bcrypt.hash(password, 12, (err, hash) => {
    if (err) {
      console.error("Error al realizar la consulta:", err);
      res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.status(500).json({ error: 'Error en la base de datos' });
    } else {
      const hashBase64 = Buffer.from(hash).toString('base64');
      db.query("INSERT INTO users (username, email, password, admin) VALUES (?, ?, ?, ?)", [username, email, hashBase64, isAdmin], (err, result) => {
        if (err) {
          console.error("Error al realizar la consulta:", err);
          res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
          res.status(500).json({ error: 'Error en la base de datos' });
        } else {
          const response = { username: username, email: email, admin: isAdmin }
          res.send(response);
        }
      });
    }
  });
});

app.post('/userexist?', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin || 0;

  if (!username || !email || !password) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    return res.status(400).json({ error: 'Nombre de usuario, Email y Contraseña son obligatorios' });
  }


  db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], (err, result) => {
    if (err) {
      console.error("Error al realizar la consulta:", err);
      res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    if (result.length > 0) {

      res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      return res.status(400).json({ error: 'Nombre de usuario o email ya existen' });
    }

    const response = { username: username, email: email, admin: isAdmin }
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.send(response);
  });
});

//Mailer
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/enviar-correo', async (req, res) => {
  try {
    const { username, email, code, nombrePagina, nombrePaginaTodoJunto } = req.body;
    const info = await transporter.sendMail({
      from: `"${nombrePagina}" <${nombrePaginaTodoJunto}Ecommerce.com.ar>`,
      to: email,
      subject: "Verificación de correo",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
      
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
      
            .banner {
              max-width: 100%;
              height: auto;
              display: block;
              margin-bottom: 20px; /* Ajusta según sea necesario */
            }
      
            h1 {
              color: #333333;
            }
      
            p {
              color: #555555;
            }
      
            a {
              color: #3498db;
              text-decoration: none;
            }
      
            a:hover {
              text-decoration: underline;
            }
      
            img {
              max-width: 100%;
              height: auto;
              display: block;
              margin-bottom: 20px; /* Ajusta según sea necesario */
            }
      
            .footer {
              margin-top: 20px;
              text-align: center;
              color: #777777;
            }
          </style>
          </head>
          <body>
            <div class="container">
              <a href="">
                <img class="banner" src="/src/media/logo.png" alt="a">
              </a>
              <h1>Bienvenido a ${nombrePagina}</h1>
              <p>Hola, ${username}</p>
              <p>Gracias por registrarte.</p>
              <p>Tu codigo de verificacion es:</p>
              <h3><strong>${code}</strong></h3>
              <p>Si tienes alguna pregunta, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
              <p>Atentamente,</p>
              <p>el equipo de ${nombrePagina}</p>
            </div>
          <div class="footer">
            <p>footer</p>
          </div>
          </body>
          </html>
        `,
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).send('Correo enviado con éxito');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor al enviar el correo' });
  }
});

// Multer para imagenes articulos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(directorioActual, 'public/prod_img'));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

//borrar todas las fotos de las categorias
app.post('/borrar-category-folders', (req, res) => {
  const imgArtFolder = directorioActual + "\\public\\category";
  fse.emptyDir(imgArtFolder, (err) => {
    if (err) {
      console.log('')
    } else {
      console.log('')
    }
  });
});

//borrar todas las fotos de los articulos
app.post('/borrar-banner-folders', (req, res) => {
  const imgArtFolder = directorioActual + "\\public\\banner_img";
  fse.emptyDir(imgArtFolder, (err) => {
    if (err) {
      console.log('')
    } else {
      console.log('')
    }
  });
});

//borrar todas las fotos de los articulos
app.post('/borrar-art-folders', (req, res) => {
  const imgArtFolder = directorioActual + "\\public\\prod_img";
  fse.emptyDir(imgArtFolder, (err) => {
    if (err) {
      console.log('')
    } else {
      console.log('')
    }
  });
});

//controlador de imagenes de articulos
//subida de nombres de fotos y codigos
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file && req.body.codigoArt) {
    const { codigoArt } = req.body;
    const nombreArchivo = req.file.filename;

    const insertQuery = 'INSERT INTO imgcontroller (Codigo_Art, Nombre_Arch) VALUES (?, ?)';
    db.query(insertQuery, [codigoArt, nombreArchivo], (err, result) => {
      if (err) {
        console.error('Error al insertar en la base de datos:', err);
        res.status(500).send('Error al guardar la información en la base de datos');
      } else {
        res.status(200).send('Archivo subido y detalles guardados en la base de datos');
      }
    });
  } else {
    res.status(400).send('Error: Archivo o SKUCode no especificados');
  }
});

//get a los datos
app.get('/getuploadedinfo', (req, res) => {
  const query = 'SELECT * FROM ecommerce.imgcontroller';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los productos desde la base de datos');
    } else {
      res.status(200).json(results);
    }
  });
});
//delete a la imagen de producto y a los datos
app.delete('/deleteimage/:id', async (req, res) => {
  const imageId = req.params.id;
  const deleteQuery = 'DELETE FROM imgcontroller WHERE Nombre_Arch = ?';
  try {
    db.query('SELECT Nombre_Arch FROM imgcontroller WHERE Nombre_Arch = ?', [imageId], (selectErr, selectResult) => {
      if (selectErr) {
        console.error('Error al seleccionar la imagen:', selectErr);
        res.status(500).send('Error al seleccionar la imagen');
        return;
      }
      const imagePath = path.join(directorioActual, 'public/prod_img', selectResult[0].Nombre_Arch);

      db.query(deleteQuery, [imageId], (deleteErr, result) => {
        if (deleteErr) {
          console.error('Error al eliminar la imagen de la base de datos:', deleteErr);
          res.status(500).send('Error al eliminar la imagen de la base de datos');
        } else {
          fs.unlink(imagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error al eliminar la imagen localmente:', unlinkErr);
              res.status(500).send('Error al eliminar la imagen localmente');
            } else {
              res.status(200).send('Imagen eliminada correctamente');
            }
          });
        }
      });
    });
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    res.status(500).send('Error al eliminar la imagen');
  }
});

// login
app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT user_id, password, admin FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error en la base de datos' });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Usuario no encontrado' });
    } else {
      const storedPasswordBase4 = results[0].password;
      const storedPassword = Buffer.from(storedPasswordBase4, 'base64').toString();
      const isAdmin = results[0].admin;
      const userId = results[0].user_id;

      bcrypt.compare(password, storedPassword, (err, match) => {
        if (err) {
          res.status(500).json({ error: 'Error en la comparacion de contraseñas' });
        } else if (match) {
          res.json({ mensaje: 'Inicio de sesion exitoso', admin: isAdmin, user_id: userId, username: username });
        } else {
          res.status(401).json({ error: 'Contraseña incorrecta' });
        }
      });
    }
  });
});

// HERRAMIENTA ADMIN - password reset 
app.post('/reset-password', (req, res) => {
  const username = req.body.username;
  const newPassword = req.body.newPassword;

  if (!username || !newPassword) {
    return res.status(400).json({ error: 'Nombre de usuario y nueva contraseña son obligatorios' });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    bcrypt.hash(newPassword, 12, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: 'Error al hashear la contraseña' });
      } else {
        const hashBase64 = Buffer.from(hash).toString('base64');
        db.query('UPDATE users SET password = ? WHERE username = ?', [hashBase64, username], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al actualizar la contraseña en la base de datos' });
          }

          return res.json({ mensaje: 'Contraseña restablecida con éxito' });
        })
      };
    });
  });
});



//WIDGET WHATSAPP //

//Guardar datos del widget de whatsapp
app.post('/guardar-widget-whatsapp', async (req, res) => {
  const { phoneNumber, contactName, textMessage, statusMessage } = req.body;

  try {
    db.query('UPDATE dynamic_data SET contenido = ? WHERE id = 3', [phoneNumber]);
    db.query('UPDATE dynamic_data SET contenido = ? WHERE id = 4', [contactName]);
    db.query('UPDATE dynamic_data SET contenido = ? WHERE id = 5', [textMessage]);
    db.query('UPDATE dynamic_data SET contenido = ? WHERE id = 6', [statusMessage]);

    res.status(200).send('Datos actualizados correctamente');
  } catch (error) {
    console.error('Error al actualizar los datos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// get a los datos
app.get('/obtener-widget-whatsapp', (req, res) => {
  const ids = [3, 4, 5, 6];

  const query = 'SELECT id, contenido FROM dynamic_data WHERE id IN (?)';

  db.query(query, [ids], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
    } else {
      res.json(results);
    }
  });
});
// WIDGET WHATSAPP //


//lista de precios
app.post('/guardar-contenido-listaprecios', (req, res) => {
  const selectedOption = req.body.selectedPriceList;
  const priceListData = req.body.priceListData;
  const selectedData = priceListData.find(item => item.PriceListNumber === parseInt(selectedOption));

  if (!selectedData) {
    return res.status(400).json({ error: 'La opción seleccionada no es válida.' });
  }

  db.query(
    'UPDATE dynamic_data SET contenido = ?, numero_identificacion = ? WHERE Id = 7',
    [selectedData.Description, selectedData.PriceListNumber],
    (error, results) => {
      if (error) {
        console.error('Error al guardar datos en la base de datos:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }

      res.status(200).json({ message: 'Datos guardados correctamente en la base de datos.' });
    }
  );
});

//obtener la lista de precios seleccionada
app.get('/obtener-contenido-listaprecios', (req, res) => {
  db.query('SELECT * FROM dynamic_data WHERE Id = 7', (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
    } else {
      res.json(results);
    }
  });
});


//lista de depositos
app.post('/guardar-contenido-listadepositos', (req, res) => {
  const selectedOption = req.body.selectedDepositoList;
  const depositoListData = req.body.depositoListData;
  const selectedData = depositoListData.find(item => item.Code === parseInt(selectedOption));

  if (!selectedData) {
    return res.status(400).json({ error: 'La opción seleccionada no es válida.' });
  }

  db.query(
    'UPDATE dynamic_data SET contenido = ?, numero_identificacion = ? WHERE Id = 8',
    [selectedData.Description, selectedData.Code],
    (error, results) => {
      if (error) {
        console.error('Error al guardar datos en la base de datos:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }

      res.status(200).json({ message: 'Datos guardados correctamente en la base de datos.' });
    }
  );
});

//obtener la lista de deposito seleccionada
app.get('/obtener-contenido-listadepositos', (req, res) => {
  db.query('SELECT * FROM dynamic_data WHERE Id = 8', (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
    } else {
      res.json(results);
    }
  });
});




//guardar footer
app.post('/guardar-contenido-footer', async (req, res) => {
  const { contenido, backgroundColor } = req.body;

  const validBackgroundColor = backgroundColor && typeof backgroundColor === 'object'
    ? backgroundColor
    : { r: 0, g: 0, b: 0, a: 0 };

  const sanitizedBackgroundColor = {
    r: validBackgroundColor.r || null,
    g: validBackgroundColor.g || null,
    b: validBackgroundColor.b || null,
    a: validBackgroundColor.a || null,
  };

  const consultaExistencia = 'SELECT COUNT(*) as count FROM dynamic_data';
  const [resultadoExistencia] = await db.promise().query(consultaExistencia);
  const existeFila = resultadoExistencia[0].count > 0;

  try {
    if (existeFila) {
      const sqlUpdate = 'UPDATE dynamic_data SET contenido = ?, color_r = ?, color_g = ?, color_b = ?, color_a = ? WHERE id = 1';
      await db.promise().execute(sqlUpdate, [
        contenido,
        sanitizedBackgroundColor.r,
        sanitizedBackgroundColor.g,
        sanitizedBackgroundColor.b,
        sanitizedBackgroundColor.a,
      ]);
    } else {
      const sqlInsert = 'INSERT INTO dynamic_data (contenido, color_r, color_g, color_b, color_a) VALUES (?, ?, ?, ?, ?)';
      await db.promise().execute(sqlInsert, [
        contenido,
        sanitizedBackgroundColor.r,
        sanitizedBackgroundColor.g,
        sanitizedBackgroundColor.b,
        sanitizedBackgroundColor.a,
      ]);
    }

    return res.status(200).json({ message: 'Contenido y colores guardados con éxito.' });
  } catch (error) {
    console.error('Error al guardar o actualizar el contenido y colores en la base de datos:', error);
    return res.status(500).json({ error: 'Error al guardar o actualizar el contenido y colores en la base de datos' });
  }
});

// obtener footer
app.get('/obtener-contenido-footer', (req, res) => {
  const sql = 'SELECT contenido, color_r, color_g, color_b, color_a FROM dynamic_data WHERE id = 1';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error al obtener el contenido y colores:', err);
      return res.status(500).json({ error: 'Error al obtener el contenido y colores.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'No se encontró contenido y colores.' });
    }

    const { contenido, color_r, color_g, color_b, color_a } = result[0];
    const backgroundColor = { r: color_r, g: color_g, b: color_b, a: color_a };

    return res.status(200).json({ contenido, backgroundColor });
  });
});

//guardar nombre de pagina
app.post('/guardar-nombre-pagina', async (req, res) => {
  const { nombrePagina } = req.body;

  try {
    const sqlReplace = 'REPLACE INTO dynamic_data (id, nombre, contenido) VALUES (?, ?, ?)';
    await db.promise().execute(sqlReplace, [2, "Nombre de la Pagina", nombrePagina]);

    return res.status(200).json({ message: 'Nombre de la página guardado con éxito.' });
  } catch (error) {
    console.error('Error al guardar el nombre de la página:', error);
    return res.status(500).json({ error: 'Error al guardar el nombre de la página.' });
  }
});

//obtener nombre de pagina
app.get('/obtener-nombre-pagina', async (req, res) => {
  try {
    const sql = 'SELECT contenido FROM dynamic_data WHERE id = 2';
    const [result] = await db.promise().query(sql);

    if (result.length > 0) {
      const nombrePagina = result[0].contenido;
      return res.status(200).json({ nombrePagina });
    } else {
      return res.status(404).json({ error: 'Nombre de la página no encontrado.' });
    }
  } catch (error) {
    console.error('Error al obtener el nombre de la página:', error);
    return res.status(500).json({ error: 'Error al obtener el nombre de la página.' });
  }
});

// editar informacion del usuario en los settings
app.put('/user-info-form/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const {
    nameValue,
    lastnameValue,
    phoneValue,
    documentType,
    documentValue,
    provinceNumber,
    addressValue,
    numberaddressValue,
    postalValue,
    cityValue
  } = req.body;

  // Encriptar datos
  const encryptedName = encryptData(nameValue);
  const encryptedLastname = encryptData(lastnameValue);
  const encryptedPhone = encryptData(phoneValue);
  const encryptedDocument = encryptData(documentValue);
  const encryptedAddress = encryptData(addressValue);
  const encryptedNumberAddress = encryptData(numberaddressValue);
  const encryptedPostal = encryptData(postalValue);
  const encryptedCity = encryptData(cityValue);

  db.query(
    'UPDATE users SET nombre = ?, apellido = ?, numero_telefono = ?, tipo_documento = ?, documento = ?, provincia = ?, calle = ?, numero_casa = ?, codigo_postal = ?, ciudad = ? WHERE user_id = ?',
    [encryptedName, encryptedLastname, encryptedPhone, documentType, encryptedDocument, provinceNumber, encryptedAddress, encryptedNumberAddress, encryptedPostal, encryptedCity, userId],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar la información del usuario:", err);
        return res.status(500).json({ error: 'Error al actualizar la información del usuario' });
      }
      const response = { message: 'Información del usuario actualizada correctamente' };
      res.json(response);
    }
  );
});

// Informacion del usuario visualizada en los ajustes
app.get('/user-info/:user_id', (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'Falta el ID de usuario' });
  }

  db.query('SELECT email, nombre, apellido, numero_telefono, tipo_documento, documento, provincia, calle, numero_casa, codigo_postal, ciudad FROM ecommerce.users WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener la información del usuario:', err);
      return res.status(500).json({ error: 'Error al obtener la información del usuario' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userInfo = results[0];

    //desencriptar datos
    userInfo.nombre = decryptData(userInfo.nombre);
    userInfo.apellido = decryptData(userInfo.apellido);
    userInfo.numero_telefono = decryptData(userInfo.numero_telefono);
    userInfo.documento = decryptData(userInfo.documento);
    userInfo.calle = decryptData(userInfo.calle);
    userInfo.numero_casa = decryptData(userInfo.numero_casa);
    userInfo.codigo_postal = decryptData(userInfo.codigo_postal);
    userInfo.ciudad = decryptData(userInfo.ciudad);

    res.json(userInfo);
  });
});

// muestra las ordenes individualmente de cada usuario
app.get('/order-info/:user_id', (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'Falta el ID de usuario' });
  }

  db.query('SELECT * FROM ecommerce.orders WHERE customer_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener la información del pedido:', err);
      return res.status(500).json({ error: 'Error al obtener la información del pedido' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(results);
  });
});

// HERRAMIENTA ADMIN - muestra las ordenes de todos los usuarios
app.get('/orders-info', (req, res) => {

  db.query('SELECT * FROM ecommerce.orders', (err, results) => {
    if (err) {
      console.error('Error al obtener la información de los pedidos:', err);
      return res.status(500).json({ error: 'Error al obtener la información de los pedidos' });
    }

    res.json(results);
  });
});

// muestra los productos de cada orden
app.get('/order-products/:order_id', (req, res) => {
  const orderId = req.params.order_id;

  db.query('SELECT * FROM ecommerce.products WHERE order_id = ?', [orderId], (err, results) => {
    if (err) {
      console.error('Error al obtener los productos del pedido:', err);
      return res.status(500).json({ error: 'Error al obtener la información de los pedidos' });
    }

    res.json(results);
  });
});

// cancelar ordenes en la base de datos
app.put('/orders-status/:id_orden', (req, res) => {
  const id_orden = req.params.id_orden;
  const newOrderStatus = req.body.order_status;

  // verifica si la orden ya ha sido cancelada
  db.query('SELECT order_status FROM orders WHERE order_id = ?', [id_orden], (err, result) => {
    if (err) {
      console.error('Error al buscar el estado de la orden:', err);
      return res.status(500).json({ error: 'Error al buscar el estado de la orden' });
    }

    const currentOrderStatus = result[0].order_status;

    if (currentOrderStatus === 1 && newOrderStatus === 0) {
      return res.status(400).json({ error: 'La orden ya ha sido cancelada' });
    }

    // actualiza el estado de la orden
    db.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [newOrderStatus, id_orden], (err, result) => {
      if (err) {
        console.error('Error al cambiar el estado de la orden:', err);
        return res.status(500).json({ error: 'Error al cambiar el estado de la orden' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }

      return res.json({ mensaje: 'Estado de la orden actualizado con éxito' });
    });
  });
});

// elimina la orden de la base de datos
app.delete('/delete-order/:id_orden', (req, res) => {
  const id_orden = req.params.id_orden;

  const deleteOrderQuery = 'DELETE FROM orders WHERE order_id = ?';
  db.query(deleteOrderQuery, [id_orden], (error, results) => {
    if (error) {
      console.error('Error al eliminar la orden:', error);
      return res.status(500).json({ error: 'Error al eliminar la orden' });
    }

    if (results.affectedRows === 0) {
      console.log('No se encontró la orden con el ID proporcionado.');
      return res.status(404).json({ error: 'No se encontró la orden con el ID proporcionado' });
    }

    res.json({ message: 'Orden eliminada con éxito' });
  });
});

// HERRAMIENTA ADMIN - lista de usuarios
app.get('/users', (req, res) => {
  db.query('SELECT user_id, email, username, nombre, apellido, documento, admin FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    const usersData = results.map(user => {
      return {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        nombre: decryptData(user.nombre),
        apellido: decryptData(user.apellido),
        documento: decryptData(user.documento),
        admin: user.admin
      };
    });

    res.json(usersData);
  });
});

// comprobacion de usuario es admin
app.get('/user-is-admin/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!userId || userId.toLowerCase() === 'null') {
    return res.json({ isAdmin: 0 });
  }

  db.query('SELECT admin FROM users WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    if (results.length === 0) {
      return res.json({ isAdmin: 0 });
    }

    const isAdmin = results[0].admin;
    res.json({ isAdmin });
  });
});

// datos de usuario
app.get('/user-data', (req, res) => {
  const userData = req.user;
  res.json({ username: userData.username });
});

// HERRAMIENTA ADMIN - asignar administradores
app.put('/edit-admin/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const newAdminValue = req.body.admin;

  if (newAdminValue !== 0 && newAdminValue !== 1) {
    return res.status(400).json({ error: 'El valor de admin debe ser 0 o 1' });
  }

  db.query('UPDATE users SET admin = ? WHERE user_id = ?', [newAdminValue, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json({ isAdmin: newAdminValue });
  });
});

// HERRAMIENTA ADMIN - eliminar usuarios
app.delete('/delete-user/:user_id', (req, res) => {
  const userId = req.params.user_id;

  db.query('DELETE FROM users WHERE user_id = ?', [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json({ mensaje: 'Usuario eliminado con éxito' });
  });
});

// guardar pedidos en la base de datos
app.post('/save-order', (req, res) => {
  const orderData = JSON.parse(Object.keys(req.body)[0]);

  const { Date, Total, OrderID, Customer, CancelOrder, OrderItems } = orderData;

  const order_id = OrderID;
  const customer_id = Customer.CustomerID;
  const date = Date;
  const iva_category = Customer.IVACategoryCode;
  const order_status = CancelOrder;
  const total = Total;

  const orderQuery = 'INSERT INTO ecommerce.orders (order_id, customer_id, date, iva_category, order_status, total) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(orderQuery, [order_id, customer_id, date, iva_category, order_status, total], (orderError, orderResults) => {
    if (orderError) {
      return res.status(500).json({ success: false, error: orderError.message });
    }

    const insertProduct = (item, callback) => {
      const productQuery = 'INSERT INTO products (order_id, product_code, product_name, product_quantity, product_unitprice) VALUES (?, ?, ?, ?, ?)';
      db.query(productQuery, [order_id, item.ProductCode, item.Description, item.Quantity, item.UnitPrice], (productError, productResults) => {
        if (productError) {
          return callback(productError);
        }
        callback(null);
      });
    };
    let insertionErrors = [];

    const tasks = OrderItems.map((item) => {
      return (callback) => {
        insertProduct(item, (err) => {
          if (err) {
            insertionErrors.push(err);
          }
          callback();
        });
      };
    });

    async.parallel(tasks, () => {
      if (insertionErrors.length > 0) {
        return res.status(500).json({ success: false, errors: insertionErrors });
      }
      return res.status(200).json({ success: true });
    });
  });
});

// eliminar cuenta por medio del usuario
app.delete('/delete-account/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const enteredPassword = req.body.password;
  db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const storedPasswordBase64 = results[0].password;
    const storedPassword = Buffer.from(storedPasswordBase64, 'base64').toString();

    bcrypt.compare(enteredPassword, storedPassword, (err, match) => {
      if (err) {
        return res.status(500).json({ error: 'Error al comparar las contraseñas' });
      }

      if (match) {
        db.query('DELETE FROM users WHERE user_id = ?', [userId], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
          }

          return res.json({ mensaje: 'Usuario eliminado con éxito' });
        });
      } else {
        return res.status(401).json({ error: 'La contraseña es incorrecta. No se pudo eliminar la cuenta.' });
      }
    });
  });
});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
})