
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import React, { useState, useEffect } from 'react';


function App() {
  const url = "http://localhost:19893/api/users"
  const [data, setData] = useState([])
  const [modalInsert, setModalInsert] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [userSeleccionado, setUserSeleccionado] = useState({
        id: "",
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        cargo: "",
        rolId: ""
  })

  const handleChange = e => {
    const { name, value } = e.target;
    setUserSeleccionado({
      ...userSeleccionado,
      [name]: value
    })

  }
  const abrirCerrarModal = () => {
    setModalInsert(!modalInsert)
  }
  const abrirCerrarModalEdit = () => {
    setModalEdit(!modalEdit)
  }
  const abrirCerrarModalDelete = () => {
    setModalDelete(!modalDelete)
  }

  const peticionGet = async () => {
    await axios.get(url)
      .then(res => {
        setData(res.data)
      }).catch(err => {
        console.log(err);
      })
  }

  const peticionPost = async () => {
    delete userSeleccionado.id;
    userSeleccionado.rolId = parseInt(userSeleccionado.rolId)
    await axios.post(url, userSeleccionado)
      .then(res => {
        setData(data.concat(res.data))
        abrirCerrarModal();
      }).catch(err => {
        console.log(err);
      })
  }
  
  const peticionPut = async () => {
    userSeleccionado.rolId = parseInt(userSeleccionado.rolId)
    await axios.put(url + "/" + userSeleccionado.id, userSeleccionado)
      .then(res => {
        data.map(elem => {
          if (elem.id === userSeleccionado.id) {
            elem.nombre = res.data.nombre;
            elem.apellido = res.data.apellido;
            elem.email = res.data.email;
            elem.telefono = res.data.telefono;
            elem.cargo = res.data.cargo;
            elem.rolId = res.data.rolId;
          }
        })
        abrirCerrarModalEdit();
      }).catch(err => {
        console.log(err);
      })
  }

  const peticionDelete = async () => {
   
    await axios.delete(url + "/" + userSeleccionado.id)
      .then(res => {
       setData(data.filter(elem=>elem.id !== res.data));
       abrirCerrarModalDelete();
      }).catch(err => {
        console.log(err);
      })
  }


  const seleccionarUser = (user, caso) => {
    setUserSeleccionado(user);
    (caso ==="Editar") 
    ? abrirCerrarModalEdit()
    : abrirCerrarModalDelete()
  }

  useEffect(() => {
    peticionGet();
  }, [])

  return (
    <div className="App">
      <br /><br />
      <button className="btn btn-success mb-4" onClick={() => abrirCerrarModal()}>Insertar nuevo Elemento</button>
      <table className="table table-bordered">
        <thead >
          <tr>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>APELLIDO</th>
            <th>EMAIL</th>
            <th>TELEFONO</th>
            <th>CARGO</th>
            <th>ROL ID</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user =>(
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.apellido}</td>
              <td>{user.email}</td>
              <td>{user.telefono}</td>
              <td>{user.cargo}</td>
              <td>{user.rolId}</td>
              <td>
                <button
                  className="btn btn-primary" 
                  onClick={()=>seleccionarUser(user,"Editar")}
                  >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={()=>seleccionarUser(user,"Eliminar")}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalInsert}>
        <ModalHeader>Insertar Elemento</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label >Nombre:</label>
            <br />
            <input onChange={handleChange} name="nombre" type="text" className="form-control" />
            <br />
            <label >Apellido:</label>
            <br />
            <input onChange={handleChange} name="apellido" type="text" className="form-control" />
            <br />
            <label >Email:</label>
            <br />
            <input onChange={handleChange} name="email" type="text" className="form-control" />
            <br />
            <label >Telefono:</label>
            <br />
            <input onChange={handleChange} name="telefono" type="text" className="form-control" />
            <br />
            <label >Cargo:</label>
            <br />
            <input onChange={handleChange} name="cargo" type="text" className="form-control" />
            <br />
            <label >Rol ID:</label>
            <br />
            <input onChange={handleChange} name="rolId" type="text" className="form-control" />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => peticionPost()} className="btn btn-primary">Insertar</button>
          <button onClick={() => abrirCerrarModal()} className="btn btn-danger">Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdit}>
        <ModalHeader>Editar Elemento</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label >Id:</label>
            <br />
            <input  onChange={handleChange} value={userSeleccionado && userSeleccionado.id} type="text" className="form-control" readOnly />
            <br />
            <label >Nombre:</label>
            <br />
            <input name="nombre" onChange={handleChange} value={userSeleccionado && userSeleccionado.nombre} type="text" className="form-control" />
            <br />
            <label >Apellido:</label>
            <br />
            <input name="apellido" onChange={handleChange} value={userSeleccionado && userSeleccionado.apellido} type="text" className="form-control" />
            <br />
            <label >Email:</label>
            <br />
            <input name="email" onChange={handleChange} value={userSeleccionado && userSeleccionado.email} type="text" className="form-control" />
            <br />
            <label >Telefono:</label>
            <br />
            <input name="telefono" onChange={handleChange} value={userSeleccionado && userSeleccionado.telefono} type="text" className="form-control" />
            <br />
            <label >Cargo:</label>
            <br />
            <input name="cargo" onChange={handleChange} value={userSeleccionado && userSeleccionado.cargo} type="text" className="form-control" />
            <br />
            <label >Rol ID:</label>
            <br />
            <input name="rolId" onChange={handleChange} value={userSeleccionado && userSeleccionado.rolId} type="text" className="form-control" />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => peticionPut()} className="btn btn-primary">Registrar</button>
          <button onClick={() => abrirCerrarModalEdit()} className="btn btn-danger">Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete}>
        <ModalHeader>Eliminar Elemento</ModalHeader>
        <ModalBody>
         ¿Deseas eliminar {userSeleccionado && userSeleccionado.nombre}
        </ModalBody>
        <ModalFooter>
          <button onClick={() => peticionDelete()} className="btn btn-danger">Si</button>
          <button onClick={() => abrirCerrarModalDelete()} className="btn btn-secundary">No</button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;

