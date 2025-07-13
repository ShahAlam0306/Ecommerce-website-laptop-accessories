// Function to get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Function to save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to add product to cart
function addToCart(id, name, price, image) {
    let cart = getCart(); // Get existing cart data from localStorage
    let product = cart.find(item => item.id === id);
    
    if (product) {
        product.quantity += 1; // Increase quantity if item already exists
    } else {
        cart.push({ id, name, price, image, quantity: 1 }); // Add new item
    }

    saveCart(cart);
    updateCartCount();
    alert(`${name} added to cart!`);
}

// Function to update cart count in header
function updateCartCount() {
    let cart = getCart();
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}
function toggleAvailability(id) {
    var list = document.getElementById(id);
    var toggleBtn = list.previousElementSibling;

    if (list.style.display === "none" || list.style.display === "") {
        list.style.display = "block";
        toggleBtn.innerHTML = "➖"; // Change to minus when expanded
    } else {
        list.style.display = "none";
        toggleBtn.innerHTML = "➕"; // Change back to plus when collapsed
    }
}

// Function to display cart items in cart page
function displayCartItems() {
    let cart = getCart();
    let cartList = document.getElementById('cart-list');
    let cartTotal = document.getElementById('cart-total');
    
    if (!cartList || !cartTotal) return;
    
    cartList.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        let li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="50">
            ${item.name} - $${item.price} x ${item.quantity}
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartList.appendChild(li);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(id) {
    let cart = getCart();
    let productIndex = cart.findIndex(item => item.id === id);
    
    if (productIndex !== -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1; // Reduce quantity
        } else {
            cart.splice(productIndex, 1); // Remove if only 1 left
        }
    }

    saveCart(cart);
    displayCartItems();
    updateCartCount();
}


// Function to clear cart
function clearCart() {
    localStorage.removeItem('cart');
    displayCartItems();
    updateCartCount();
}

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", function () {
    const exchangeRate = 83; // USD to INR conversion rate (approximate)
    
    document.querySelectorAll(".product p").forEach(priceTag => {
        let priceText = priceTag.textContent;
        let match = priceText.match(/\$(\d+)/); // Find price in USD
        
        if (match) {
            let usdPrice = parseFloat(match[1]);
            let inrPrice = Math.round(usdPrice * exchangeRate);
            priceTag.textContent = `₹${inrPrice}`;
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cart-container");
    const totalPriceElement = document.getElementById("total-price");
    const totalItemsElement = document.getElementById("total-items");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartUI() {
        cartContainer.innerHTML = "";
        let totalPrice = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            totalPriceElement.textContent = "0.00";
            totalItemsElement.textContent = "0";
            return;
        }

        cart.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-img">
                <div class="cart-info">
                    <p><strong>${item.name}</strong></p>
                    <p>Price: ₹${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            cartContainer.appendChild(itemElement);

            totalPrice += item.price * item.quantity;
            totalItems += item.quantity;
        });

        totalPriceElement.textContent = totalPrice.toFixed(2);
        totalItemsElement.textContent = totalItems;
    }

    cartContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-btn")) {
            const index = event.target.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartUI();
        }
    });

    document.getElementById("checkout-btn").addEventListener("click", function () {
        alert("Proceeding to checkout...");
        // Add checkout functionality here
    });

    updateCartUI();
});
// Function to display cart items in cart page
function displayCartItems() {
    let cart = getCart();
    let cartContainer = document.getElementById("cart-container");
    let cartTotal = document.getElementById("total-price");
    let totalItems = document.getElementById("total-items");

    if (!cartContainer || !cartTotal) return;

    cartContainer.innerHTML = "";
    let total = 0;
    let itemCount = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "0.00";
        totalItems.textContent = "0";
        return;
    }

    cart.forEach((item, index) => {
        let cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-img" width="80">
            <div class="cart-info">
                <p><strong>${item.name}</strong></p>
                <p>Price: ₹${(item.price * 83).toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;

        cartContainer.appendChild(cartItem);
        total += item.price * item.quantity * 83; // Convert to INR
        itemCount += item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
    totalItems.textContent = itemCount;
}

// Run function when page loads
document.addEventListener("DOMContentLoaded", displayCartItems);
