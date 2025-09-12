// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', date: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchTodos(); }, []);

  async function fetchTodos() {
    try {
      const res = await axios.get(`${API}/todos`);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
      alert('Error cargando los todos');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.date) {
      alert('Título y fecha son obligatorios');
      return;
    }
    try {
      if (editingId) {
        await axios.put(`${API}/todos/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${API}/todos`, form);
      }
      setForm({ title: '', content: '', date: '' });
      fetchTodos();
    } catch (err) {
      console.error(err);
      alert('Error guardando');
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este todo?')) return;
    try {
      await axios.delete(`${API}/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error(err);
      alert('Error eliminando');
    }
  }

  async function toggleComplete(id) {
    try {
      await axios.patch(`${API}/todos/${id}/complete`);
      fetchTodos();
    } catch (err) {
      console.error(err);
      alert('Error actualizando estado');
    }
  }

  function startEdit(todo) {
    setEditingId(todo._id);
    setForm({ title: todo.title, content: todo.content, date: new Date(todo.date).toISOString().slice(0,10) });
  }

  return (
    <div style={{
      maxWidth:1200,
      margin:'0 auto',
      padding:20,
      fontFamily:'sans-serif',
      display:'flex',
      gap:40
    }}>
      
      {/* Lista de tareas con scroll */}
      <div style={{flex:1, display:'flex', flexDirection:'column'}}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" 
       alt="React" 
       style={{ width: 33, verticalAlign: 'middle', marginRight: 8 }} />
      <h1 style={{ textAlign: 'left' }}>To-Do List (React)</h1>

        <p><strong>Total de registros:</strong> {todos.length}</p>

        <div style={{
          flex:1,
          maxHeight:'500px',
          overflowY:'auto',
          paddingRight:10
        }}>
          <ul style={{listStyle:'none', padding:0, margin:0}}>
            {todos.map(todo => (
              <li key={todo._id} style={{padding:12, border:'1px solid #ddd', borderRadius:6, marginBottom:8, background:'#000'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <div>
                    <label style={{display:'flex', alignItems:'center', gap:8}}>
                      <input type="checkbox" checked={todo.completed} onChange={()=>toggleComplete(todo._id)} />
                      <strong style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>{todo.title}</strong>
                    </label>
                    <div style={{fontSize:12, color:'#555'}}>{new Date(todo.date).toLocaleDateString()}</div>
                    <p style={{marginTop:8}}>{todo.content}</p>
                  </div>

                  <div style={{display:'flex', flexDirection:'column', gap:6}}>
                    <button onClick={()=>startEdit(todo)}>Editar</button>
                    <button onClick={()=>handleDelete(todo._id)} style={{color:'red'}}>Eliminar</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Formulario con fondo transparente */}
      <div style={{
        flex:1.2,
        display:'flex',
        justifyContent:'flex-end',
        alignItems:'center',
        marginLeft:190
      }}>
        <form onSubmit={handleSubmit} style={{
          background:'#fff3', // fondo transparente
          padding:35,
          width:'100%',
          maxWidth:500,
          minHeight:480,
          borderRadius:8,
          border:'1px solid #ccc'
        }}>
          <h2 style={{textAlign:'center', marginBottom:20, fontWeight:'bold', color:'#fff'}}>
            📝 {editingId ? 'Editar To-Do' : 'Crear To-Do'}
          </h2>
          <input
            placeholder="Título"
            value={form.title}
            onChange={(e)=>setForm({...form, title: e.target.value})}
            style={{
              padding:12,
              width:'100%',
              marginBottom:12,
              fontSize:16,
              borderRadius:8,
              border:'1px solid #ccc',
              backgroundColor:'#0001'
            }}
          />
          <input
            type="date"
            value={form.date}
            onChange={(e)=>setForm({...form, date: e.target.value})}
            style={{
              padding:12,
              width:'100%',
              marginBottom:12,
              fontSize:16,
              borderRadius:8,
              border:'1px solid #ccc',
              backgroundColor:'#0001'
            }}
          />
          <textarea
            placeholder="Contenido (opcional)"
            value={form.content}
            onChange={(e)=>setForm({...form, content: e.target.value})}
            style={{
              padding:12,
              width:'100%',
              minHeight:120,
              marginBottom:12,
              fontSize:16,
              borderRadius:8,
              border:'1px solid #ccc',
              backgroundColor:'#0001'
            }}
          />
          <button type="submit" style={{
            padding:'14px 16px',
            backgroundColor:'#007bff',
            color:'#fff',
            border:'none',
            borderRadius:8,
            cursor:'pointer',
            width:'100%',
            fontSize:16,
            fontWeight:'bold'
          }}>
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={()=>{setEditingId(null); setForm({title:'',content:'',date:''})}}
              style={{
                marginTop:10,
                width:'100%',
                backgroundColor:'#ccc',
                border:'none',
                padding:'10px 12px',
                borderRadius:8,
                cursor:'pointer',
                fontSize:16
              }}
            >
              Cancelar
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
