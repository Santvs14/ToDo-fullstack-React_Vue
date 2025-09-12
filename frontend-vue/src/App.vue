<template>
  <div
    style="
      max-width:1200px;
      margin:0 auto;
      padding:20px;
      font-family:sans-serif;
      display:flex;
      gap:40px;
    "
  >
    <!-- LISTADO DE TAREAS CON SCROLL -->
    <div style="flex:1; display:flex; flex-direction:column;">
      <h1 style="text-align:left;">To-Do List (Vue)</h1>
      <p><strong>Total de registros:</strong> {{ todos.length }}</p>

      <div
        style="
          flex:1;
          max-height:500px;
          overflow-y:auto;
          padding-right:10px;
        "
      >
        <ul style="list-style:none; padding:0; margin:0;">
          <li
            v-for="todo in todos"
            :key="todo._id"
            style="
              padding:12px;
              border:1px solid #ddd;
              border-radius:6px;
              margin-bottom:8px;
              background:#0001;
            "
          >
            <div style="display:flex; align-items:flex-start; justify-content:space-between;">
              <div>
                <label style="display:flex; align-items:center; gap:8px;">
                  <input
                    type="checkbox"
                    :checked="todo.completed"
                    @change="toggleComplete(todo._id)"
                  />
                  <strong :style="{ textDecoration: todo.completed ? 'line-through' : 'none' }">
                    {{ todo.title }}
                  </strong>
                </label>
                <div style="font-size:12px; color:#555;">{{ formatDate(todo.date) }}</div>
                <p style="margin-top:8px;">{{ todo.content }}</p>
              </div>

              <div style="display:flex; flex-direction:column; gap:6px;">
                <button @click="editTodo(todo)">Editar</button>
                <button @click="deleteTodo(todo._id)" style="color:red;">Eliminar</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- FORMULARIO A LA DERECHA -->
    <div style="flex:1.2; display:flex; justify-content:flex-end; align-items:center; margin-left:200px;">
      <form
        @submit.prevent="submit"
        style="
          background:#fff3;
          padding:35px;
          width:100%;
          max-width:500px;
          min-height:480px;
          border-radius:8px;
          border:1px solid #ccc;
        "
      >
        <h2 style="text-align:center; margin-bottom:20px; font-weight:bold; color:#333;">
          📝 {{ editingId ? 'Editar To-Do' : 'Crear To-Do' }}
        </h2>
        <input
          v-model="form.title"
          placeholder="Título"
          style="
            padding:12px;
            width:100%;
            margin-bottom:12px;
            font-size:16px;
            border-radius:8px;
            border:1px solid #ccc;
            background-color:#f0f0f0;
          "
        />
        <input
          v-model="form.date"
          type="date"
          style="
            padding:12px;
            width:100%;
            margin-bottom:12px;
            font-size:16px;
            border-radius:8px;
            border:1px solid #ccc;
            background-color:#f0f0f0;
          "
        />
        <textarea
          v-model="form.content"
          placeholder="Contenido (opcional)"
          style="
            padding:12px;
            width:100%;
            min-height:120px;
            margin-bottom:12px;
            font-size:16px;
            border-radius:8px;
            border:1px solid #ccc;
            background-color:#f0f0f0;
          "
        ></textarea>
        <button
          type="submit"
          style="
            padding:14px 16px;
            background-color:#007bff;
            color:#fff;
            border:none;
            border-radius:8px;
            cursor:pointer;
            width:100%;
            font-size:16px;
            font-weight:bold;
          "
        >
          {{ editingId ? 'Actualizar' : 'Crear' }}
        </button>
        <button
          v-if="editingId"
          type="button"
          @click="cancelEdit"
          style="
            margin-top:10px;
            width:100%;
            background-color:#ccc;
            border:none;
            padding:10px 12px;
            border-radius:8px;
            cursor:pointer;
            font-size:16px;
          "
        >
          Cancelar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const todos = ref([]);
const form = ref({ title: '', content: '', date: '' });
const editingId = ref(null);

async function fetchTodos() {
  try {
    const res = await axios.get(`${API}/todos`);
    todos.value = res.data;
  } catch (err) {
    console.error(err);
    alert('Error cargando todos');
  }
}

onMounted(fetchTodos);

async function submit() {
  if (!form.value.title || !form.value.date) {
    alert('Título y fecha son obligatorios');
    return;
  }
  try {
    if (editingId.value) {
      await axios.put(`${API}/todos/${editingId.value}`, form.value);
      editingId.value = null;
    } else {
      await axios.post(`${API}/todos`, form.value);
    }
    form.value = { title: '', content: '', date: '' };
    fetchTodos();
  } catch (err) {
    console.error(err);
    alert('Error guardando');
  }
}

async function deleteTodo(id) {
  if (!confirm('¿Eliminar este todo?')) return;
  await axios.delete(`${API}/todos/${id}`);
  fetchTodos();
}

async function toggleComplete(id) {
  await axios.patch(`${API}/todos/${id}/complete`);
  fetchTodos();
}

function editTodo(todo) {
  editingId.value = todo._id;
  form.value = {
    title: todo.title,
    content: todo.content,
    date: new Date(todo.date).toISOString().slice(0, 10),
  };
}

function cancelEdit() {
  editingId.value = null;
  form.value = { title: '', content: '', date: '' };
}

function formatDate(d) {
  return new Date(d).toLocaleDateString();
}
</script>
