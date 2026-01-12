// Админ-панель
document.addEventListener('DOMContentLoaded', function() {
    initAdminPanel();
});

function initAdminPanel() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const addProductBtn = document.getElementById('add-product-btn');
    const exportProductsBtn = document.getElementById('export-products-btn');
    const cancelFormBtn = document.getElementById('cancel-form-btn');
    const productForm = document.getElementById('product-form');
    const productFormContainer = document.getElementById('product-form-container');
    
    // Проверить, авторизован ли пользователь
    checkAuth();
    
    // Вход в админ-панель
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            
            if (username === 'admin' && password === 'admin123') {
                // Сохранить сессию
                localStorage.setItem('hoztovary_admin', 'true');
                showAdminPanel();
            } else {
                showNotification('Неверный логин или пароль', 'error');
            }
        });
    }
    
    // Выход из админ-панели
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('hoztovary_admin');
            hideAdminPanel();
        });
    }
    
    // Добавление товара
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            showProductForm();
        });
    }
    
    // Экспорт данных
    if (exportProductsBtn) {
        exportProductsBtn.addEventListener('click', exportProducts);
    }
    
    // Отмена формы
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', function() {
            hideProductForm();
            resetProductForm();
        });
    }
    
    // Обработка формы товара
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
    }
    
    // Загрузить список товаров для админ-панели
    loadAdminProducts();
}

// Проверка авторизации
function checkAuth() {
    const isAdmin = localStorage.getItem('hoztovary_admin') === 'true';
    if (isAdmin) {
        showAdminPanel();
    }
}

// Показать админ-панель
function showAdminPanel() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
}

// Скрыть админ-панель
function hideAdminPanel() {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
}

// Показать форму товара
function showProductForm() {
    document.getElementById('product-form-container').style.display = 'block';
    document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
}

// Скрыть форму товара
function hideProductForm() {
    document.getElementById('product-form-container').style.display = 'none';
}

// Сброс формы товара
function resetProductForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
}

// Загрузка товаров для админ-панели
function loadAdminProducts() {
    const adminProductsBody = document.getElementById('admin-products-body');
    if (!adminProductsBody) return;
    
    // Используем глобальную переменную products из script.js
    const productsToDisplay = products;
    
    adminProductsBody.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.brand || '-'}</td>
            <td>${product.price.toLocaleString()} ₽</td>
            <td>${product.stock}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" data-id="${product.id}">
                        <i class="fas fa-edit"></i> Изменить
                    </button>
                    <button class="delete-btn" data-id="${product.id}">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                </div>
            </td>
        `;
        
        adminProductsBody.appendChild(row);
    });
    
    // Добавить обработчики для кнопок
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

// Редактирование товара
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Заполнить форму
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-brand').value = product.brand || '';
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-image').value = product.image || '';
    
    // Показать форму
    showProductForm();
}

// Удаление товара
function deleteProduct(productId) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    
    // Удалить из массива товаров
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products.splice(index, 1);
        
        // Обновить localStorage
        saveProductsToStorage();
        
        // Обновить списки
        loadAdminProducts();
        
        // Обновить каталог, если он открыт
        if (document.getElementById('catalog').classList.contains('active')) {
            applyFilters();
        }
        
        showNotification('Товар успешно удален', 'success');
    }
}

// Сохранение товара
function saveProduct() {
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const category = document.getElementById('product-category').value;
    const brand = document.getElementById('product-brand').value;
    const stock = parseInt(document.getElementById('product-stock').value);
    const image = document.getElementById('product-image').value;
    
    // Валидация
    if (!name || !price || !category || isNaN(stock)) {
        showNotification('Заполните все обязательные поля', 'error');
        return;
    }
    
    if (productId) {
        // Редактирование существующего товара
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                description,
                category,
                brand,
                stock,
                image: image || products[index].image
            };
        }
    } else {
        // Добавление нового товара
        const newId = Math.max(...products.map(p => p.id)) + 1;
        products.push({
            id: newId,
            name,
            price,
            description,
            category,
            brand,
            stock,
            image
        });
    }
    
    // Обновить хранилище
    saveProductsToStorage();
    
    // Обновить интерфейс
    loadAdminProducts();
    
    // Обновить каталог, если он открыт
    if (document.getElementById('catalog').classList.contains('active')) {
        applyFilters();
    }
    
    // Скрыть форму и сбросить
    hideProductForm();
    resetProductForm();
    
    showNotification('Товар успешно сохранен', 'success');
}

// Экспорт товаров
function exportProducts() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hoztovary-products.json';
    link.click();
    
    URL.revokeObjectURL(url);
    
    showNotification('Данные успешно экспортированы', 'success');
}