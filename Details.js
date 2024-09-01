let data = {}; 

function fetchData() {
  const url = "https://aulamindhub.github.io/amazing-api/events.json";

  return fetch(url)
    .then(response => response.json())
    .then(json => {
      data = json; 
      return data; 
    })
    .catch(error => {
      console.error("Error al obtener los datos:", error);
    });
}

function displayEventDetails() {
  let parametro = new URLSearchParams(window.location.search);
  let eventoId = parametro.get('id');
  
  if (!data.events) {
    console.error("No se han cargado los datos de eventos.");
    return;
  }
  
  let evento = data.events.find(event => event._id === parseInt(eventoId));
  let detailsDiv = document.getElementById('event-details');
  
  if (evento) {
    detailsDiv.className = 'tarjetaDetails';
    detailsDiv.innerHTML = `
      <div class="card mb-3" style="max-width: 76vh;">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${evento.image}" class="img-fluid rounded-start" alt="${evento.name}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${evento.name}</h5>
              <p><strong>Date:</strong> ${evento.date}</p>
              <p class="card-text">${evento.description}</p>
              <p><strong>Category:</strong> ${evento.category}</p>
              <p><strong>Place:</strong> ${evento.place}</p>
              <p><strong>Capacity:</strong> ${evento.capacity}</p>
              <p><strong>Price:</strong> ${evento.price} USD</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    detailsDiv.innerHTML = '<p class="no-notas">Event not found.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchData().then(() => {
    if (window.location.pathname.includes('details.html')) {
      displayEventDetails();
    }
  });
});

