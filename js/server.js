const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware para analizar el cuerpo de las solicitudes JSON
app.use(cors());

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lista_de_tareas',
});

db.connect((error) => {
  if (error) {
    console.error('Error de conexión a la base de datos: ' + error.message);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});
// Definir una ruta para la página de inicio (ruta raíz)
app.get('/', (req, res) => {
  // Tu código para manejar la página de inicio
  res.send('¡Bienvenido a mi aplicación!');
});
// Ruta para obtener todas las tareas
app.get('/tareas', (req, res) => {
  db.query('SELECT * FROM tareas', (error, results) => {
    if (error) {
      console.error('Error al obtener tareas:', error);
      res.status(500).json({ error: 'Error al obtener tareas' });
    } else {
      res.json(results);
    }
  });
});

// Ruta para agregar una nueva tarea
app.post('/tareas', (req, res) => {
  const nuevaTarea = req.body; // La nueva tarea enviada en el cuerpo de la solicitud

  db.query('INSERT INTO tareas (nombre) VALUES (?)', [nuevaTarea.nombre], (error, result) => {
    if (error) {
      console.error('Error al agregar tarea:', error);
      res.status(500).json({ error: 'Error al agregar tarea' });
    } else {
      nuevaTarea.id = result.insertId;
      res.json(nuevaTarea);
    }
  });
});

// Ruta para editar una tarea existente
app.put('/tareas/:id', (req, res) => {
  const taskId = req.params.id; // ID de la tarea a editar
  const tareaEditada = req.body; // Datos editados de la tarea

  db.query('UPDATE tareas SET nombre = ? WHERE id = ?', [tareaEditada.nombre, taskId], (error) => {
    if (error) {
      console.error('Error al editar tarea:', error);
      res.status(500).json({ error: 'Error al editar tarea' });
    } else {
      res.json(tareaEditada);
    }
  });
});

// Ruta para eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
  const taskId = req.params.id; // ID de la tarea a eliminar

  db.query('DELETE FROM tareas WHERE id = ?', taskId, (error) => {
    if (error) {
      console.error('Error al eliminar tarea:', error);
      res.status(500).json({ error: 'Error al eliminar tarea' });
    } else {
      res.json({ message: 'Tarea eliminada con éxito' });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
