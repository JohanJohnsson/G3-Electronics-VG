/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.addEventListener('click', function (event) {
        event.preventDefault();

        removeAlerts();

        const inputName = document.getElementById('inputName').value.trim();
        const inputEmail = document.getElementById('inputEmail').value.trim();
        const inputPhone = document.getElementById('inputPhone').value.trim();
        const inputAddress = document.getElementById('inputAddress').value.trim();
        const inputCity = document.getElementById('inputCity').value.trim();
        const inputZip = document.getElementById('inputZip').value.trim();
        let isValid = true;

        const onlyLettersRegex = /^[A-Za-z\s]{2,50}$/;
        const containsAtRegex = /@/;
        const phoneRegex = /^[0-9\d\s()-]{1,50}$/;
        const onlyNumbersRegex = /[0-9]/;

        if (!onlyLettersRegex.test(inputName)) {
            displayAlert("Name must be between 2 and 50 characters long and contain only letters.", document.getElementById('inputName'));
            isValid = false;
        }

        if (inputEmail.length > 50 || !containsAtRegex.test(inputEmail)) {
            displayAlert('E-postadressen får inte vara längre än 50 tecken och måste innehålla @.', document.getElementById('inputEmail'));
            isValid = false;
        }

        if (!phoneRegex.test(inputPhone)) {
            displayAlert('Numret får endast innehålla siffror, paranteser, bindestreck och max 50 tecken långt.', document.getElementById('inputPhone'));
            isValid = false;
        }

        if (inputAddress.length < 2 || inputAddress.length > 50) {
            displayAlert('Addressen får endast vara minst 2 tecken och max 50 tecken.', document.getElementById('inputAddress'));
            isValid = false;
        }

        if (!onlyLettersRegex.test(inputCity)) {
            displayAlert('Staden får endast innehålla 2-50 tecken.', document.getElementById('inputCity'))
            isValid = false;
        }

        if (!inputZip.length === 5 || !onlyNumbersRegex.test(inputZip)) {
            displayAlert('Postkoden får endast vara 5 siffror', document.getElementById('inputZip'));
            isValid = false;
        }

        if (isValid) {
            window.location.href = 'purchaseConfirmationPage.html';
        }
    });
});


function displayAlert(message, inputField) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-danger');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.textContent = message;

    inputField.parentNode.insertBefore(alertDiv, inputField.nextSibling);
}


function removeAlerts() {
    const alerts = document.querySelectorAll('.alert-danger');
    alerts.forEach(alert => alert.remove());
}

fetch("https://fakestoreapi.com/products/category/electronics")
    .then((res) => res.json())
    .then((json) => {
        json.forEach((item) => {
            try {
                createCard(item);
            } catch (error) {

            }
        });
    });



function createCard(product) {
    const id = product.id;
    const title = product.title;
    const price = "Price: " + product.price + "$";
    const description = product.description;
    const image = product.image;

    const cardIndex = document.querySelectorAll('.card').length;
    if (cardIndex % 3 === 0) {
        const newRow = document.createElement("div");
        newRow.classList.add("row", "d-flex", "justify-content-around");
        document.querySelector('#products').appendChild(newRow);
    }

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.classList.add("my-2");
    cardDiv.classList.add("py-5")
    cardDiv.style.width = "18rem";

    const img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = image;
    img.alt = `image describing ${title}`;
    img.style.height = "200px";

    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList.add("card-body");
    cardBodyDiv.classList.add("d-flex");
    cardBodyDiv.classList.add("flex-column");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = title.slice(0, 50);

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = description.slice(0, 100) + "...";

    const cardPrice = document.createElement("p");
    cardPrice.classList.add("card-text");
    cardPrice.classList.add("text-danger");
    cardPrice.textContent = price;

    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-dark", "mt-auto");
    btn.textContent = "Add to cart";
    btn.onclick = function () {
        // Hämta den aktuella varukorgen från localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Kolla om produkten redan finns i varukorgen
        const existingItemIndex = cart.findIndex(item => item.id === id);
        if (existingItemIndex === -1) {
            // Om produkten inte redan finns i varukorgen, lägg till den med quantity = 1
            cart.push({ id, title, price, description, image, quantity: 1 });
        } else {
            // Om produkten redan finns i varukorgen, öka antalet med 1
            cart[existingItemIndex].quantity++;
        }
        // Uppdatera räknaren för varukorgen och span-elementet
        updateCartCounter(cart);
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    function updateCartCounter(cart) {
        // Hämta räknarelementet
        const cartCounter = document.getElementById('cartItemCount');
        if (cartCounter) {
            // Beräkna totala antalet produkter i varukorgen
            const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
            // Uppdatera räknaren
            cartCounter.innerText = totalQuantity.toString();
        }
    }

    cardBodyDiv.appendChild(cardTitle);
    cardBodyDiv.appendChild(cardText);
    cardBodyDiv.appendChild(cardPrice);
    cardBodyDiv.appendChild(btn);

    cardDiv.appendChild(img);
    cardDiv.appendChild(cardBodyDiv);


    const card = document.querySelector('#products');
    card.appendChild(cardDiv);
};


document.addEventListener('DOMContentLoaded', function () {
    // Hämta varukorgsdatan från localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    // Hämta behållaren där varukorgsartiklar ska visas
    const cartItemsContainer = document.getElementById('cartItemsContainer');

    // Function to update quantity of an item in the cart
    function updateCartItemQuantity(itemId, increase) {
        // Find the item in the cart
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const index = cart.findIndex(item => item.id === itemId);

        if (index !== -1) {
            // If the item is found
            if (increase) {
                // Increase quantity if increase is true
                cart[index].quantity++;
            } else {
                // Decrease quantity if increase is false
                if (cart[index].quantity > 1) {
                    // Ensure quantity doesn't go below 1
                    cart[index].quantity--;
                } else {
                    // If quantity is 1, remove the item from the cart
                    cart.splice(index, 1);
                }
            }
            // Update the cart in localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            // Re-render the cart items
            renderCartItems();
        }
    }
    

    // Skapar mina varukorgsprodukter
    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear the container to avoid duplicates
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
            <div class="container" id="orderFormItemContainer">
                <h4></h4>
                <ul class="list-group mb-3">
                    <li class="list-group-item d-flex justify-content-between lh-condensed">
                        <div class="mx-0 px-0">
                            <img src="${item.image}" alt="${item.title}" height="50"> 
                        </div>
                        <div>
                            <h6 class="my-0">${item.title}</h6>
                            <small class="text-muted">${item.description}</small>  
                        </div>
                        <div class="priceDiv">
                        <span class="text-danger">${item.price}</span>
                        </div>
                        <div class="quantity-container">
                            <button class="btn btn-success incrementBtn" data-id="${item.id}" type="button">+</button>
                            <span id="quantityCounter">${item.quantity}</span>
                            <button class="btn btn-warning decrementBtn" data-id="${item.id}" type="button">-</button>
                            <button class="btn btn-danger removeBtn ml-3" data-id="${item.id}" type="button">Remove</button>
                        </div>
                        <div class="text-center">
                        
                        </div>
                    </li>
                </ul>
            </div>
        `;
            itemDiv.querySelector('.incrementBtn').addEventListener('click', () => {
                const itemId = item.id;
                updateCartItemQuantity(itemId, true);
            });
            itemDiv.querySelector('.decrementBtn').addEventListener('click', () => {
                const itemId = item.id;
                updateCartItemQuantity(itemId, false);
            });
            itemDiv.querySelector('.removeBtn').addEventListener('click', () => {
                const itemId = item.id;
                removeCartItem(itemId); // Anropa funktionen för att ta bort varan från varukorgen
            });
            cartItemsContainer.appendChild(itemDiv);
        });
        updateCartCounter(cart);

    }
    

    function removeCartItem(itemId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== itemId); // Filtrera bort varan med matchande ID
        localStorage.setItem('cart', JSON.stringify(cart)); // Uppdatera varukorgen i localStorage
        renderCartItems(); // Uppdatera varukorgen i gränssnittet
    }
    
    

    // Uppdatera cartCounter och räknar ut + skriver ut totalpriset
    function updateCartCounter() {
        const cartCounter = document.getElementById('cartItemCount');
        const totalPriceDisplay = document.getElementById('totalPriceContainer');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cartCounter && totalPriceDisplay) {
            const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
            const totalPrice = cart.reduce((acc, item) => acc + (parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity), 0).toFixed(2);
            cartCounter.innerText = totalQuantity.toString();
            totalPriceDisplay.innerText = "Total price: " + totalPrice + "$";
        }
    }

    
    renderCartItems();


    document.getElementById('clearCartBtn').addEventListener('click', function () {
        localStorage.setItem('cart', JSON.stringify([]));
        document.getElementById('cartItemCount').textContent = '0';
        renderCartItems();
        
    });
    

    
});


function renderPurchasedItems() {
    const cartItemsContainer = document.getElementById('purchasedItemsContainer');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0; // Totalpriset för alla inköpta objekt

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <div class="container" id="orderFormItemContainer">
                <h4>Your Purchased Item</h4>
                <ul class="list-group mb-3">
                    <li class="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <img src="${item.image}" alt="${item.title}" height="100"> 
                        </div>
                        <div>
                            <h6 class="my-2">${item.title}</h6>
                            <p class="text-muted text-end">${item.price}</p>
                            <p class="text-muted text-end">Quantity: ${item.quantity}</p>
                        </div>
                    </li>
                </ul>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);

        // Beräkna och lägg till det individuella priset för detta objekt till det totala priset
        totalPrice += parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity;
    });

    // Visa det totala priset
    const totalPriceDisplay = document.createElement('div');
    totalPriceDisplay.classList.add('text-center', 'font-weight-bold', 'fs-4', 'text-danger');
    totalPriceDisplay.textContent = `Total price: ${totalPrice}$`;
    cartItemsContainer.appendChild(totalPriceDisplay);
    
    document.getElementById('keepShoppingBtn').addEventListener('click', function () {
        console.log('Keep Shopping button clicked'); // Lägg till denna rad för att logga klickhändelsen
        // Rensa varukorgen
        localStorage.setItem('cart', JSON.stringify([]));
        // Återgå till startsidan eller valfri sida där du vill att användaren ska fortsätta shoppa
        window.location.href = 'index.html'; 
        // Uppdatera varukorgsräknaren
        document.getElementById('cartItemCount').textContent = '0';
        
        
    });

}



document.addEventListener('DOMContentLoaded', function () {
    renderPurchasedItems();
});



document.getElementById("cartButton").addEventListener("click", function () {
    window.location.href = "cart.html";
});






