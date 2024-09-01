let data = {}; 

export function fetchData() {
  const url = "https://aulamindhub.github.io/amazing-api/events.json";

  return fetch(url)
    .then(response => response.json())
    .then(json => {
      data = json; 
      console.log("Datos obtenidos de la API:", data); 
      return data;
    })
    .catch(error => {
      console.error("Error al obtener los datos:", error);
    });
}

export function filtrarevento(busqueda = '', filtroFecha) {
  if (!data.events) return;

  let currentDate = new Date(data.currentDate);
  let checkboxes = document.querySelectorAll('.form-check-input');
  let seleccategoria = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  let filtrandoeventos = data.events.filter(event => {
    let fechaDeEvento = new Date(event.date);
    let fechas = filtroFecha ? filtroFecha(fechaDeEvento, currentDate) : true;
    let categorias = seleccategoria.length === 0 || seleccategoria.includes(event.category);
    let busquedas = event.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    event.description.toLowerCase().includes(busqueda.toLowerCase());
    return fechas && categorias && busquedas;
  });

  let contenedor = document.getElementById('contenedor');
  contenedor.innerHTML = '';

  if (filtrandoeventos.length === 0) {
    contenedor.innerHTML = '<p class="no-notas">THERE ARE NO EVENTS TO SHOW</p>';
    return;
  }

  filtrandoeventos.forEach(event => {
    let tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';
    tarjeta.innerHTML = `
      <img src="${event.image}" class="card-img-top" alt="${event.name}">
      <div class="card-body">
        <h5 class="card-title">${event.name}</h5>
        <p class="card-text">${event.description}</p>
      </div>
      <div class="p-2 d-flex justify-content-between align-items-center">
        <p class="mb-0">${event.price} USD</p>
        <a href="./details.html?id=${event._id}" class="btn btn-success">Details</a>
      </div>
    `;
    contenedor.appendChild(tarjeta);
  });
}

export function compararTodos(fechaDeEvento, currentDate) {
  return true;
}

export function compararPasados(fechaDeEvento, currentDate) {
  return fechaDeEvento < currentDate;
}

export function fechasFuturas(fechaDeEvento, currentDate) {
    return fechaDeEvento > currentDate;
  }