//  CONFIGURACIÓN DE VISUALIZACIÓN INICIAL 
const INITIAL_VISIBLE_ROWS = 6; // Define cuántas filas se verán al inicio.
let allProductsShown = false; // Bandera para saber si ya se han mostrado todos.

// Variables del DOM (Se inicializan más tarde en DOMContentLoaded)
let searchInput;
let productsTable;
let rows;
let tableBody;
let totalPriceElement;
let toggleEditButton;
let container;
let editMode = false;

// Función principal para inicializar la lógica de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de elementos del DOM
    searchInput = document.getElementById('searchInput');
    productsTable = document.getElementById('productosTable'); // Asegúrate de usar el ID correcto
    rows = productsTable.getElementsByTagName('tr'); // Obtiene todas las filas de la tabla
    tableBody = productsTable.querySelector('tbody');
    totalPriceElement = document.getElementById('totalPrice');
    container = document.querySelector('.container');
    
    // Inicializar la vista de productos (Ver más)
    initializeProductView();

    // Inicializar el filtro de búsqueda
    searchInput.addEventListener('keyup', handleSearch);

    // Inicializar el cálculo del total
    document.querySelectorAll('.product-quantity').forEach(input => {
        input.addEventListener('change', calculateTotal);
        input.addEventListener('input', calculateTotal);
    });
    calculateTotal();

    // Inicializar el botón de edición de precios
    createEditButton();
});


//  LÓGICA DE CARGA INICIAL Y BOTÓN "VER MÁS" 

function initializeProductView() {
    if (rows.length - 1 > INITIAL_VISIBLE_ROWS) {
        for (let i = INITIAL_VISIBLE_ROWS + 1; i < rows.length; i++) {
            rows[i].style.display = 'none';
        }
        createShowMoreButton();
    }
}

function createShowMoreButton() {
    const showMoreButton = document.createElement('button');
    showMoreButton.id = 'showMoreBtn';
    showMoreButton.textContent = `Mostrar todos (${rows.length - 1} productos)`;
    showMoreButton.style.display = 'block';
    showMoreButton.style.marginTop = '20px';
    showMoreButton.style.marginBottom = '15px'; // Agregamos margen inferior para espaciado
    showMoreButton.style.padding = '10px 15px';
    showMoreButton.style.backgroundColor = '#4CAF50';
    showMoreButton.style.color = 'white';
    showMoreButton.style.border = 'none';
    showMoreButton.style.borderRadius = '8px';
    showMoreButton.style.cursor = 'pointer';
    showMoreButton.style.fontWeight = '600';
    showMoreButton.style.transition = 'background-color 0.3s ease';
    showMoreButton.style.width = '100%'; // Hacer que ocupe todo el ancho para mejor visualización

    showMoreButton.onmouseover = function() {
        this.style.backgroundColor = '#45a049';
    };
    showMoreButton.onmouseout = function() {
        this.style.backgroundColor = '#4CAF50';
    };
    
    productsTable.parentNode.insertBefore(showMoreButton, productsTable.nextSibling);

    showMoreButton.addEventListener('click', () => {
        for (let i = INITIAL_VISIBLE_ROWS + 1; i < rows.length; i++) {
            rows[i].style.display = '';
        }
        showMoreButton.style.display = 'none';
        allProductsShown = true;
    });
}


//  Filtro de búsqueda  
function handleSearch() {
    const filter = searchInput.value.toLowerCase();
    const showMoreBtn = document.getElementById('showMoreBtn');
    
    if (filter.length > 0) {
        if (showMoreBtn) showMoreBtn.style.display = 'none';
    } else {
        if (showMoreBtn && !allProductsShown) {
             showMoreBtn.style.display = 'block';
        }
    }

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const productName = row.getElementsByTagName('td')[0].textContent.toLowerCase();

        if (productName.includes(filter)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
        
        if (filter.length === 0 && !allProductsShown && i > INITIAL_VISIBLE_ROWS) {
             row.style.display = 'none';
        }
    }
}


//  Cálculo del total  
function calculateTotal() {
    const quantityInputs = document.querySelectorAll('.product-quantity');
    let total = 0;

    quantityInputs.forEach(input => {
        const price = parseFloat(input.dataset.price);
        const quantity = parseInt(input.value);

        if (!isNaN(quantity) && quantity > 0) {
            total += price * quantity;
        }
    });

    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}


//  Apartado para editar precios  
function createEditButton() {
    toggleEditButton = document.createElement('button');
    toggleEditButton.textContent = "🔧 Editar precios";
    toggleEditButton.style.marginBottom = "15px";
    toggleEditButton.style.padding = "10px 15px";
    toggleEditButton.style.backgroundColor = "#1E88E5";
    toggleEditButton.style.color = "white";
    toggleEditButton.style.border = "none";
    toggleEditButton.style.borderRadius = "8px";
    toggleEditButton.style.cursor = "pointer";
    toggleEditButton.style.fontWeight = "600";
    toggleEditButton.style.transition = "background-color 0.3s ease";
    toggleEditButton.style.width = '20%'; // Hacer que ocupe todo el ancho para mejor visualización
    toggleEditButton.style.marginTop = '20px'; // Agregar margen superior

    // Insertar el botón antes del contenedor de búsqueda (para que quede más accesible)
    const searchContainer = document.querySelector('.search-container');
    container.insertBefore(toggleEditButton, searchContainer);

    toggleEditButton.addEventListener('click', () => {
        editMode = !editMode;
        toggleEditButton.textContent = editMode ? "💾 Guardar precios" : "🔧 Editar precios";
        toggleEditButton.style.backgroundColor = editMode ? "#FFC107" : "#1E88E5"; // Cambia color para indicar modo edición
        toggleEditButton.style.color = editMode ? "#333" : "white";

        const priceCells = document.querySelectorAll('.price-cell');
        const quantityInputs = document.querySelectorAll('.product-quantity');
        const isEditing = editMode;

        // Si entramos en modo edición, desactivamos los campos de cantidad
        quantityInputs.forEach(input => {
            input.disabled = isEditing;
        });

        priceCells.forEach(cell => {
            if (isEditing) {
                // Modo Edición: Mostrar input
                const currentPrice = parseFloat(cell.textContent.replace('$', ''));
                cell.innerHTML = `<input type="number" step="0.01" min="0" value="${currentPrice}" class="edit-price" style="width:80%;text-align:center;padding:5px;border-radius:4px;border:1px solid #ccc;">`;
            } else {
                // Modo Guardar: Guardar nuevo precio y mostrarlo como texto
                const priceInput = cell.querySelector('input');
                if (priceInput) {
                    let newPrice = parseFloat(priceInput.value);
                    if (isNaN(newPrice) || newPrice < 0) {
                        // Prevención de datos inválidos, mantiene el precio anterior si es inválido
                        newPrice = parseFloat(cell.parentElement.querySelector('.product-quantity').dataset.price);
                    }
                    newPrice = newPrice.toFixed(2);
                    
                    const row = cell.parentElement;
                    const quantityInput = row.querySelector('.product-quantity');
                    
                    // Actualizar el atributo data-price para que el cálculo total use el nuevo valor
                    quantityInput.dataset.price = newPrice;
                    
                    cell.innerHTML = `$${newPrice}`;
                }
            }
        });

        // Recalcular el total después de guardar los precios
        if (!isEditing) calculateTotal();
    });
}
