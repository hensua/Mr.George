document.addEventListener('DOMContentLoaded', function () {
    const products = document.querySelectorAll('.product');
    const cartList = document.querySelector('.cart-list');
    const totalAmount = document.querySelector('.total-amount');
    const amountPaid = document.getElementById('amount-paid');
    const changeAmount = document.querySelector('.change-amount');
    const checkoutButton = document.getElementById('checkout-button');

    let cart = [];
    let totalPrice = 0;

    // Función para agregar un producto al carrito
    function addToCart(productName, productPrice, quantity) {
        let existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            existingItem = { name: productName, price: parseInt(productPrice.replace(/\D/g, '')), quantity };
            cart.push(existingItem);
        }

        // Actualiza la vista del carrito
        updateCartView();

        // Calcula el total y actualiza el totalAmount
        const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
        totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        totalAmount.textContent = formatter.format(totalPrice);
    }

    // Función para quitar un producto del carrito
    function removeFromCart(productName) {
        const itemIndex = cart.findIndex(item => item.name === productName);

        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
        }

        // Actualiza la vista del carrito
        updateCartView();

        // Calcula el total y actualiza el totalAmount
        const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
        totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        totalAmount.textContent = formatter.format(totalPrice);
    }

    // Evento para agregar un producto al hacer clic en el botón "Agregar"
    products.forEach(product => {
        const addButton = product.querySelector('.add-button');
        const quantityInput = product.querySelector('.quantity-input');
        const productName = product.querySelector('.product-name').textContent;
        const productPrice = product.querySelector('.product-price').textContent; // El precio ya está en formato COP

        addButton.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value) || 1;
            if (quantity > 0) {
                addToCart(productName, productPrice, quantity);

                // Limpia la cantidad después de agregar al carrito
                quantityInput.value = '';
                quantityInput.placeholder = 'Cantidad'; // También puedes eliminar el placeholder si lo deseas
            }
        });
    });

    // Evento para confirmar la compra y calcular el cambio
    checkoutButton.addEventListener('click', () => {
        const paidAmount = parseFloat(amountPaid.value);
        if (!isNaN(paidAmount) && paidAmount >= totalPrice) {
            const change = paidAmount - totalPrice;
            const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
            changeAmount.textContent = formatter.format(change);
            // Aquí puedes enviar la orden y realizar otras acciones necesarias
        } else {
            alert('El monto pagado es insuficiente.');
        }
    });

    // Función para actualizar la vista del carrito
    function updateCartView() {
        // Limpia la lista actual de elementos en el carrito
        cartList.innerHTML = '';

        // Recorre el carrito y agrega los elementos a la lista
        const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} x ${item.quantity} - ${formatter.format(item.price * item.quantity)}`;

            // Botón para quitar el producto del carrito
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Quitar';
            removeButton.addEventListener('click', () => {
                removeFromCart(item.name);

                // Limpia el campo de entrada del monto
                amountPaid.value = '';
                amountPaid.placeholder = 'Monto Pagado (COP)'; // También puedes eliminar el placeholder si lo deseas
                changeAmount.textContent = formatter.format(0); // Establece el cambio en cero
            });

            listItem.appendChild(removeButton);
            cartList.appendChild(listItem);
        });
    }
});


