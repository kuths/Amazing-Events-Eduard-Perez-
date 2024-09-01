import { fetchData, filtrarevento, fechasFuturas } from './modules/data.js';

document.addEventListener('DOMContentLoaded', () => {
  fetchData().then(() => {
    filtrarevento('', fechasFuturas);
  });
});

document.querySelector('#buscador input[type="search"]').addEventListener('input', function() {
  const searchInput = document.querySelector('#buscador input[type="search"]');
  const searchTerm = searchInput.value;
  filtrarevento(searchTerm, fechasFuturas);
});

document.querySelectorAll('.form-check-input').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const searchInput = document.querySelector('#buscador input[type="search"]');
    const searchTerm = searchInput.value;
    filtrarevento(searchTerm, fechasFuturas);
  });
});
