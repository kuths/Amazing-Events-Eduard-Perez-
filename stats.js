import { fetchData, fechasFuturas, compararPasados } from './modules/data.js';

function createTable() {
  let tabla = document.createElement('table');
  tabla.className = 'table';
  let initabla = document.createElement('thead');
  initabla.innerHTML = `
    <tr>
      <th colspan="3" class="table-secondary">Events Statistics</th>
    </tr>
    <tr class="subtitle_table">
      <th>Events with highest % of assistance</th>
      <th>Events with lowest % of assistance</th>
      <th>Events with larger capacity</th>
    </tr>
    <tr id="row-highest-assistance">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th colspan="3" class="table-secondary">Upcoming Events Statistics by Category</th>
    </tr>
    <tr class="subtitle_table">
      <th>Categories</th>
      <th>Revenues</th>
      <th>Percentage of assistance</th>
    </tr>
    <tr id="row-category-1">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr id="row-category-2">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr id="row-category-3">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr id="row-category-4">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr id="row-category-5">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr id="row-category-6">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th colspan="3" class="table-secondary">Past Events Statistics by Category</th>
    </tr>
    <tr class="subtitle_table">
      <th>Categories</th>
      <th>Revenues</th>
      <th>Percentage of assistance</th>
    </tr>
    <tr id="row-past-category-1">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr id="row-past-category-2">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr id="row-past-category-3">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr id="row-past-category-4">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr id="row-past-category-5">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr id="row-past-category-6">
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr id="row-past-category-7">
      <td></td>
      <td></td>
      <td></td>
    </tr>
  `;
  tabla.appendChild(initabla);
  const tbody = document.createElement('tbody');
  tabla.appendChild(tbody);
  const container = document.getElementById('tabla-estadisticas');
  container.appendChild(tabla);
}

function updateStatisticsTable() {
  fetchData().then(data => {
    let eventoConMayorAsistencia = null;
    let mayorPorcentaje = -1;

    let eventoMenorAsistencia = null;
    let menorPorcentaje = 101; 

    let eventoMayorCapacidad = null;
    let mayorCapacidad = -1;

    data.events.forEach(event => {
      if (event.capacity) {
        let porcentaje = event.assistance
          ? (event.assistance / event.capacity) * 100
          : (event.estimate / event.capacity) * 100;

        if (porcentaje > mayorPorcentaje) {
          mayorPorcentaje = porcentaje;
          eventoConMayorAsistencia = event;
        }

        if (porcentaje < menorPorcentaje) {
          menorPorcentaje = porcentaje;
          eventoMenorAsistencia = event;
        }
      }

      if (event.capacity > mayorCapacidad) {
        mayorCapacidad = event.capacity;
        eventoMayorCapacidad = event;
      }
    });

    if (eventoConMayorAsistencia) {
      const tdHighest = document.querySelector('#row-highest-assistance td:nth-child(1)');
      tdHighest.innerHTML = `
        <strong>${eventoConMayorAsistencia.name}</strong><br>
        ${eventoConMayorAsistencia.assistance || eventoConMayorAsistencia.estimate} attendees<br>
        Capacity: ${eventoConMayorAsistencia.capacity}<br>
        Assistance %: ${mayorPorcentaje.toFixed(2)}%
      `;
    }

    if (eventoMenorAsistencia) {
      const tdLowest = document.querySelector('#row-highest-assistance td:nth-child(2)');
      tdLowest.innerHTML = `
        <strong>${eventoMenorAsistencia.name}</strong><br>
        ${eventoMenorAsistencia.assistance || eventoMenorAsistencia.estimate} attendees<br>
        Capacity: ${eventoMenorAsistencia.capacity}<br>
        Assistance %: ${menorPorcentaje.toFixed(2)}%
      `;
    }

    if (eventoMayorCapacidad) {
      const tdLargestCapacity = document.querySelector('#row-highest-assistance td:nth-child(3)');
      tdLargestCapacity.innerHTML = `
        <strong>${eventoMayorCapacidad.name}</strong><br>
        Capacity: ${eventoMayorCapacidad.capacity}<br>
      `;
    }

    let futurosEventos = data.events.filter(event => fechasFuturas(new Date(event.date), new Date(data.currentDate)));

    let futureCategoryStats = {};

    futurosEventos.forEach(event => {
      if (!futureCategoryStats[event.category]) {
        futureCategoryStats[event.category] = {
          revenue: 0,
          totalCapacity: 0,
          totalAssistance: 0
        };
      }
      futureCategoryStats[event.category].revenue += (event.price * event.estimate);
      futureCategoryStats[event.category].totalCapacity += event.capacity;
      futureCategoryStats[event.category].totalAssistance += event.assistance || event.estimate;
    });

    let futureCategoryRows = document.querySelectorAll('tr[id^="row-category-"]');
    let futureRowIndex = 0;

    for (let category in futureCategoryStats) {
      if (futureRowIndex >= futureCategoryRows.length) break;
      let categoryRow = futureCategoryRows[futureRowIndex];
      let categoryData = futureCategoryStats[category];
      
      let averageAssistancePercentage = (categoryData.totalAssistance / categoryData.totalCapacity) * 100;

      categoryRow.innerHTML = `
        <td>${category}</td>
        <td>${categoryData.revenue.toFixed(2)}</td>
        <td>${averageAssistancePercentage.toFixed(2)}%</td>
      `;
      futureRowIndex++;
    }

    let pastEvents = data.events.filter(event => compararPasados(new Date(event.date), new Date(data.currentDate)));

    let pastCategoryStats = {};

    pastEvents.forEach(event => {
      if (!pastCategoryStats[event.category]) {
        pastCategoryStats[event.category] = {
          revenue: 0,
          totalCapacity: 0,
          totalAssistance: 0
        };
      }
      pastCategoryStats[event.category].revenue += (event.price * event.assistance);
      pastCategoryStats[event.category].totalCapacity += event.capacity;
      pastCategoryStats[event.category].totalAssistance += event.assistance;
    });

    let pastCategoryRows = document.querySelectorAll('tr[id^="row-past-category-"]');
    let pastRowIndex = 0;

    for (let category in pastCategoryStats) {
      if (pastRowIndex >= pastCategoryRows.length) break;
      let categoryRow = pastCategoryRows[pastRowIndex];
      let categoryData = pastCategoryStats[category];
      
      let averageAssistancePercentage = (categoryData.totalAssistance / categoryData.totalCapacity) * 100;

      categoryRow.innerHTML = `
        <td>${category}</td>
        <td>${categoryData.revenue.toFixed(2)}</td>
        <td>${averageAssistancePercentage.toFixed(2)}%</td>
      `;
      pastRowIndex++;
    }

  }).catch(error => {
    console.error("Error al obtener los datos:", error);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createTable();
  updateStatisticsTable();
});
