const input = document.querySelector('input');
const addBtn = document.querySelector('.btn-add');
const ul = document.querySelector('.ul');
const empty = document.querySelector('.empty');

const obtenerTareas = () => {
  fetch('http://localhost:3000/tareas') // Realiza una solicitud GET a la ruta '/tareas'
    .then((response) => response.json()) // Convierte la respuesta a formato JSON
    .then((tareas) => {
      // Maneja las tareas recibidas del servidor, para mostrarlas en el frontend
      console.log(tareas);
      // Llama a una función para actualizar tu frontend con las tareas
      actualizarTareas(tareas);
    })
    .catch((error) => {
      console.error('Error al obtener tareas:', error);
    });
};

// Llama a la función para obtener tareas cuando la página cargue
window.addEventListener('load', obtenerTareas);

addBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const text = input.value;

  if (text !== '') {
    const tareaNueva = { nombre: text };
    agregarTarea(tareaNueva);
    input.value = '';
  }
});

function actualizarTareas(tareas) {
  ul.innerHTML = ''; // Limpia la lista antes de agregar las tareas

  if (tareas.length === 0) {
    empty.style.display = "none";
  } else {
    empty.style.display = "block";
    tareas.forEach((tarea) => {
      const li = createListItem(tarea.nombre, tarea.id);
      ul.appendChild(li);
    });
  }
}

function createListItem(text, taskId) {
  const li = document.createElement('li');
  const p = document.createElement('p');
  p.textContent = text;

  li.setAttribute('data-task-id', taskId);

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Editar';
  editBtn.className = 'btn-edit';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'checkbox';
  li.appendChild(checkbox);
  li.appendChild(p);
  li.appendChild(editBtn);

  // Botón de editar
  editBtn.addEventListener('click', () => {
    const editText = prompt('Por favor edite la tarea:', text);

    if (editText !== null) {
      editarTarea(taskId, editText);
    }
  });

  return li;
}

function agregarTarea(tareaNueva) {
  fetch('http://localhost:3000/tareas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tareaNueva),
  })
    .then((response) => response.json())
    .then((tarea) => {
      obtenerTareas(); // Vuelve a obtener tareas después de agregar una nueva
    })
    .catch((error) => {
      console.error('Error al agregar tarea:', error);
    });
}

function editarTarea(taskId, nuevoNombre) {
  fetch(`http://localhost:3000/tareas/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre: nuevoNombre }),
  })
    .then((response) => response.json())
    .then((tareaEditada) => {
      obtenerTareas(); // Vuelve a obtener tareas después de editar
    })
    .catch((error) => {
      console.error('Error al editar tarea:', error);
    });
}

function deleteSelected() {
  const selectedItems = ul.querySelectorAll('li input[type="checkbox"]:checked');
  selectedItems.forEach((item) => {
    const listItem = item.parentElement;
    const taskId = listItem.dataset.taskId; // Obtener el ID de la tarea desde el atributo data-task-id
    console.log(taskId)
    eliminarTarea(taskId);
  });
}

const deleteSelectedBtn = document.querySelector('.btn-delete-selected');
deleteSelectedBtn.addEventListener('click', deleteSelected);

function eliminarTarea(taskId) {
  fetch(`http://localhost:3000/tareas/${taskId}`, {
    method: 'DELETE',
  })
    .then(() => {
      obtenerTareas(); // Vuelve a obtener tareas después de eliminar
    })
    .catch((error) => {
      console.error('Error al eliminar tarea:', error);
    });
}
