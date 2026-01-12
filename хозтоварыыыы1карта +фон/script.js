// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initNavigation();
    initMaps();
    initCatalog();
    initCart();
    initDelivery();
    initModals();
    initFilters();
    
    // Загрузка товаров
    loadProducts();
    
    // Показать главную страницу
    showPage('home');
    
    // Загрузить корзину из localStorage
    loadCartFromStorage();
});

// Навигация по страницам
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Обработка кликов по навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('href').substring(1);
            showPage(pageId);
            
            // Обновить активный класс
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Закрыть меню на мобильных устройствах
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Кнопка меню для мобильных устройств
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Иконка корзины
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.addEventListener('click', function() {
        showCartModal();
    });
}

// Показать страницу
function showPage(pageId) {
    // Скрыть все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Показать выбранную страницу
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Прокрутить вверх
        window.scrollTo(0, 0);
        
        // Если это страница каталога, обновить товары
        if (pageId === 'catalog') {
            applyFilters();
        }
    }
}

// Каталог товаров
let products = [];
let filteredProducts = [];

function initCatalog() {
    // Инициализация сортировки
    const sortSelect = document.getElementById('sort-by');
    sortSelect.addEventListener('change', applyFilters);
}

// Загрузка товаров
function loadProducts() {
    // В реальном приложении здесь был бы запрос к серверу
    products = [
        {
            id: 1,
            name: "Моющий пылесос Karcher",
            category: "Бытовая химия",
            brand: "Керхер",
            price: 18999,
            stock: 5,
            description: "Профессиональный моющий пылесос для дома",
            image: ""
        },
        {
            id: 2,
            name: "Средство для мытья окон",
            category: "Бытовая химия",
            brand: "Мистер Пропер",
            price: 299,
            stock: 20,
            description: "Очиститель стекол и зеркал",
            image: ""
        },
        {
            id: 3,
            name: "Средство для чистки ковров",
            category: "Бытовая химия",
            brand: "Ваниш",
            price: 599,
            stock: 15,
            description: "Эффективно удаляет пятна с ковров",
            image: ""
        },
        {
            id: 4,
            name: "Гель для стирки",
            category: "Бытовая химия",
            brand: "Миф",
            price: 399,
            stock: 30,
            description: "Концентрированный гель для стирки",
            image: ""
        },
        {
            id: 5,
            name: "Дрель-шуруповерт",
            category: "Инструменты",
            brand: "Макита",
            price: 7999,
            stock: 8,
            description: "Аккумуляторная дрель-шуруповерт",
            image: ""
        },
        {
            id: 6,
            name: "Перфоратор",
            category: "Инструменты",
            brand: "Бош",
            price: 12999,
            stock: 3,
            description: "Мощный перфоратор для работ по бетону",
            image: ""
        },
        {
            id: 7,
            name: "Бензопила",
            category: "Инструменты",
            brand: "Ермак",
            price: 8999,
            stock: 6,
            description: "Бензиновая пила для садовых работ",
            image: ""
        },
        {
            id: 8,
            name: "Набор инструментов 150 предметов",
            category: "Инструменты",
            brand: "Макита",
            price: 15999,
            stock: 4,
            description: "Полный набор инструментов для дома",
            image: ""
        },
        {
            id: 9,
            name: "Спички хозяйственные",
            category: "Прочее",
            brand: "",
            price: 49,
            stock: 100,
            description: "Коробок спичек, 100 штук",
            image: ""
        },
        {
            id: 10,
            name: "Бензиновая зажигалка",
            category: "Прочее",
            brand: "",
            price: 299,
            stock: 25,
            description: "Надежная бензиновая зажигалка",
            image: ""
        },
        {
            id: 11,
            name: "Ведро оцинкованное",
            category: "Прочее",
            brand: "",
            price: 799,
            stock: 12,
            description: "Ведро 12 литров, оцинкованная сталь",
            image: ""
        },
        {
            id: 12,
            name: "Швабра с отжимом",
            category: "Прочее",
            brand: "",
            price: 599,
            stock: 18,
            description: "Швабра с механизмом отжима",
            image: ""
        }
    ];
    
    // Проверить, есть ли товары в localStorage
    const savedProducts = localStorage.getItem('hoztovary_products');
    if (savedProducts) {
        try {
            const parsedProducts = JSON.parse(savedProducts);
            // Объединить с базовыми товарами
            products = [...products, ...parsedProducts.filter(p => p.id > 12)];
        } catch (e) {
            console.error('Ошибка загрузки товаров из localStorage:', e);
        }
    }
    
    // Сохранить товары в localStorage
    saveProductsToStorage();
    
    // Отобразить товары
    displayProducts(products);
    filteredProducts = [...products];
    updateProductCount();
}

// Сохранение товаров в localStorage
function saveProductsToStorage() {
    localStorage.setItem('hoztovary_products', JSON.stringify(products));
}

// Отображение товаров
function displayProducts(productsToDisplay) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Создание карточки товара
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const isInStock = product.stock > 0;
    const badgeClass = isInStock ? 'in-stock' : 'out-of-stock';
    const badgeText = isInStock ? 'В наличии' : 'Нет в наличии';
    
    // Иконка в зависимости от категории
    let icon = 'fas fa-box';
    if (product.category === 'Бытовая химия') icon = 'fas fa-spray-can';
    if (product.category === 'Инструменты') icon = 'fas fa-tools';
    if (product.category === 'Прочее') icon = 'fas fa-home';
    
    card.innerHTML = `
        <div class="product-image">
            ${product.image ? 
                `<img src="${product.image}" alt="${product.name}">` : 
                `<i class="${icon}"></i>`
            }
            <span class="product-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="product-info">
            <div class="product-category">
                <i class="fas fa-tag"></i> ${product.category}
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            ${product.brand ? 
                `<div class="product-brand"><i class="fas fa-industry"></i> ${product.brand}</div>` : 
                ''
            }
            <div class="product-footer">
                <div class="product-price">${product.price.toLocaleString()} ₽</div>
                <button class="add-to-cart" ${!isInStock ? 'disabled' : ''} data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i>
                    ${isInStock ? 'В корзину' : 'Нет в наличии'}
                </button>
            </div>
        </div>
    `;
    
    // Обработчик для кнопки "В корзину"
    const addToCartBtn = card.querySelector('.add-to-cart');
    if (isInStock) {
        addToCartBtn.addEventListener('click', function() {
            addToCart(product.id);
        });
    }
    
    return card;
}

// Фильтрация товаров
function initFilters() {
    // Обработчики для фильтров
    const priceMin = document.getElementById('min-price');
    const priceMax = document.getElementById('max-price');
    const priceMinSlider = document.getElementById('price-min');
    const priceMaxSlider = document.getElementById('price-max');
    const inStockCheckbox = document.getElementById('in-stock');
    const brandFilters = document.querySelectorAll('.brand-filter');
    const otherFilters = document.querySelectorAll('.other-filter');
    const categoryFilter = document.getElementById('category-filter');
    const resetBtn = document.getElementById('reset-filters');
    
    // Синхронизация слайдеров и полей ввода
    priceMinSlider.addEventListener('input', function() {
        priceMin.value = this.value;
        applyFilters();
    });
    
    priceMaxSlider.addEventListener('input', function() {
        priceMax.value = this.value;
        applyFilters();
    });
    
    priceMin.addEventListener('input', function() {
        priceMinSlider.value = this.value;
        applyFilters();
    });
    
    priceMax.addEventListener('input', function() {
        priceMaxSlider.value = this.value;
        applyFilters();
    });
    
    // Обработчики для остальных фильтров
    inStockCheckbox.addEventListener('change', applyFilters);
    brandFilters.forEach(filter => filter.addEventListener('change', applyFilters));
    otherFilters.forEach(filter => filter.addEventListener('change', applyFilters));
    categoryFilter.addEventListener('change', applyFilters);
    
    // Кнопка сброса
    resetBtn.addEventListener('click', function() {
        resetFilters();
    });
}

// Применение фильтров
function applyFilters() {
    // Получить значения фильтров
    const minPrice = parseInt(document.getElementById('min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value) || 50000;
    const inStockOnly = document.getElementById('in-stock').checked;
    const selectedBrands = Array.from(document.querySelectorAll('.brand-filter:checked'))
                               .map(cb => cb.value);
    const selectedOther = Array.from(document.querySelectorAll('.other-filter:checked'))
                               .map(cb => cb.value);
    const selectedCategory = document.getElementById('category-filter').value;
    const sortBy = document.getElementById('sort-by').value;
    
    // Фильтрация товаров
    filteredProducts = products.filter(product => {
        // Фильтр по цене
        if (product.price < minPrice || product.price > maxPrice) return false;
        
        // Фильтр по наличию
        if (inStockOnly && product.stock <= 0) return false;
        
        // Фильтр по брендам
        if (selectedBrands.length > 0 && product.brand) {
            if (!selectedBrands.includes(product.brand)) return false;
        }
        
        // Фильтр по категории
        if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
        
        // Фильтр по "прочему"
        if (selectedOther.length > 0 && product.category === 'Прочее') {
            const productName = product.name.toLowerCase();
            const hasMatch = selectedOther.some(filter => {
                if (filter === 'спички') return productName.includes('спички');
                if (filter === 'зажигалка') return productName.includes('зажигалка');
                if (filter === 'хозинвентарь') {
                    return productName.includes('ведро') || 
                           productName.includes('швабра') ||
                           productName.includes('инвентарь');
                }
                return false;
            });
            if (!hasMatch) return false;
        }
        
        return true;
    });
    
    // Сортировка
    sortProducts(filteredProducts, sortBy);
    
    // Отображение товаров
    displayProducts(filteredProducts);
    updateProductCount();
}

// Сортировка товаров
function sortProducts(productsArray, sortBy) {
    switch(sortBy) {
        case 'price-asc':
            productsArray.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            productsArray.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            productsArray.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // По умолчанию - по ID
            productsArray.sort((a, b) => a.id - b.id);
    }
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('min-price').value = 0;
    document.getElementById('max-price').value = 50000;
    document.getElementById('price-min').value = 0;
    document.getElementById('price-max').value = 50000;
    document.getElementById('in-stock').checked = true;
    
    document.querySelectorAll('.brand-filter').forEach(cb => cb.checked = false);
    document.querySelectorAll('.other-filter').forEach(cb => cb.checked = false);
    
    document.getElementById('category-filter').value = 'all';
    document.getElementById('sort-by').value = 'default';
    
    applyFilters();
}

// Обновление счетчика товаров
function updateProductCount() {
    const countElement = document.getElementById('product-count');
    if (countElement) {
        countElement.textContent = filteredProducts.length;
    }
}

// Корзина
let cart = [];

function initCart() {
    // Обработчик для кнопки оформления заказа из корзины
    const goToDeliveryBtn = document.getElementById('go-to-delivery');
    if (goToDeliveryBtn) {
        goToDeliveryBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Добавьте товары в корзину', 'warning');
                return;
            }
            
            // Закрыть модальное окно корзины
            const cartModal = document.getElementById('cart-modal');
            cartModal.style.display = 'none';
            
            // Перейти на страницу доставки
            showPage('delivery');
            
            // Обновить навигацию
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector('[href="#delivery"]').classList.add('active');
            
            // Обновить заказ
            updateOrderSummary();
        });
    }
}

// Загрузка корзины из localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('hoztovary_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartCount();
        } catch (e) {
            console.error('Ошибка загрузки корзины:', e);
            cart = [];
        }
    }
}

// Сохранение корзины в localStorage
function saveCartToStorage() {
    localStorage.setItem('hoztovary_cart', JSON.stringify(cart));
}

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Проверить наличие
    if (product.stock <= 0) {
        showNotification('Товара нет в наличии', 'error');
        return;
    }
    
    // Проверить, есть ли уже в корзине
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Проверить, не превышает ли количество на складе
        if (existingItem.quantity >= product.stock) {
            showNotification('Недостаточно товара на складе', 'warning');
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    // Обновить корзину
    updateCartCount();
    saveCartToStorage();
    showNotification('Товар добавлен в корзину', 'success');
    
    // Обновить модальное окно корзины, если оно открыто
    const cartModal = document.getElementById('cart-modal');
    if (cartModal.style.display === 'flex') {
        updateCartModal();
    }
}

// Обновление счетчика корзины
function updateCartCount() {
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = totalItems;
    }
}

// Модальное окно корзины
function initModals() {
    const cartModal = document.getElementById('cart-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Закрытие модальных окон
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    });
    
    // Закрытие по клику вне окна
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cartModal.style.display = 'none';
        }
    });
}

// Показать модальное окно корзины
function showCartModal() {
    const cartModal = document.getElementById('cart-modal');
    updateCartModal();
    cartModal.style.display = 'flex';
}

// Обновление модального окна корзины
function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Корзина пуста</p>
            </div>
        `;
        cartTotalPrice.textContent = '0';
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽ × ${item.quantity}</div>
                </div>
                <div class="cart-item-total">${itemTotal.toLocaleString()} ₽</div>
                <button class="cart-item-remove" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHTML;
    cartTotalPrice.textContent = total.toLocaleString();
    
    // Обработчики для кнопок удаления
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

// Удаление из корзины
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartCount();
        updateCartModal();
        
        // Обновить страницу доставки, если она активна
        if (document.getElementById('delivery').classList.contains('active')) {
            updateOrderSummary();
        }
    }
}

// Доставка и заказ
function initDelivery() {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
        
        // Маска для телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
                }
                this.value = value.substring(0, 18);
            });
        }
        
        // Установить минимальную дату доставки (завтра)
        const deliveryDate = document.getElementById('delivery-date');
        if (deliveryDate) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            deliveryDate.min = tomorrow.toISOString().split('T')[0];
        }
    }
}

// Обновление сводки заказа
function updateOrderSummary() {
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    
    if (cart.length === 0) {
        orderItems.innerHTML = '<p>Корзина пуста</p>';
        orderTotal.textContent = '0';
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="order-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>${itemTotal.toLocaleString()} ₽</span>
            </div>
        `;
    });
    
    orderItems.innerHTML = itemsHTML;
    orderTotal.textContent = total.toLocaleString();
}

// Обработка оформления заказа
function handleOrderSubmit(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        showNotification('Добавьте товары в корзину', 'warning');
        return;
    }
    
    // Собрать данные формы
    const orderData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        address: document.getElementById('address').value,
        deliveryDate: document.getElementById('delivery-date').value,
        deliveryTime: document.getElementById('delivery-time').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        paymentMethod: document.querySelector('input[name="payment"]:checked').value,
        comments: document.getElementById('comments').value,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderDate: new Date().toISOString(),
        orderId: 'ORD-' + Date.now()
    };
    
    // В реальном приложении здесь был бы отправка на сервер
    console.log('Заказ оформлен:', orderData);
    
    // Показать уведомление
    showNotification('Заказ успешно оформлен! С вами свяжутся для подтверждения.', 'success');
    
    // Очистить корзину
    cart = [];
    saveCartToStorage();
    updateCartCount();
    
    // Сбросить форму
    e.target.reset();
    
    // Вернуться на главную
    setTimeout(() => {
        showPage('home');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[href="#home"]').classList.add('active');
    }, 3000);
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    // Установить цвет в зависимости от типа
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    notificationText.textContent = message;
    notification.style.display = 'block';
    
    // Скрыть через 5 секунд
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}
//ывыв
function initMaps() {
    const mapBtn = document.getElementById('show-map-btn');
    if (mapBtn) {
        mapBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Открыть Яндекс.Карты с адресом магазина
            const address = encodeURIComponent('Екатеринбург, пр-т Ленина, 24/8');
            window.open(`https://yandex.ru/maps/54/yekaterinburg/?text=${address}&z=17`, '_blank');
        });
    }
    console.log('Карты инициализированы');
}