"use strict";

// Định dạng giá
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// Cập nhật số lượng sản phẩm trong biểu tượng giỏ hàng
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector(".header-cart-icon span").innerText = cartCount;
}

// Lấy danh sách sản phẩm từ API
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/products");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const products = await response.json();
    createProductHTML(products);
  } catch (error) {
    console.error("Error loading products:", error);
    document.getElementById("product-container").innerHTML = `
      <div class="error-message">
          <p>Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.</p>
      </div>
    `;
  }
}

// Hiển thị danh sách sản phẩm
function createProductHTML(products) {
  const container = document.getElementById("product-container");
  if (!container) return;

  const productsHTML = products
    .map(
      (product) => `
        <div class="col-6 col-sm-6 col-md-4 col-lg-3">
          <div class="product-item">
            <div class="product-image">
              <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-info">
              <a href="../client/product-detail.html?id=${product.id}">
                <h2 class="h1-product">${product.title}</h2>
              </a>
              <span class="span-product">${product.material}</span>
              <p class="p-product">
                <span class="current-price">${formatPrice(
                  product.currentPrice
                )}</span>
                <span class="original-price">${formatPrice(
                  product.originalPrice
                )}</span>
              </p>
            </div>
          </div>
        </div>`
    )
    .join("");

  container.innerHTML = productsHTML;
}

// Hiển thị chi tiết sản phẩm
async function getProductDetail() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has("id")) throw new Error("Không tìm thấy ID sản phẩm");

    const productId = urlParams.get("id");
    const response = await fetch(`http://localhost:3000/products/${productId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const product = await response.json();

    const html = `
      <div class="product-detail-container">
        <div class="breadcrumb">
          <div class="text-title">
            Sản Phẩm / <span id="product-category">${product.title}</span>
          </div>
        </div>
        <div class="product-detail-content">
          <div class="product-detail-left">
            <div class="main-image">
              <img id="product-image" src="../${product.image}" alt="${
      product.title
    }" class="big-img">
            </div>
          </div>
          <div class="product-detail-right">
            <h1 id="product-title">${product.title}</h1>
            <span class="product-material" id="product-material">${
              product.material
            }</span>
            <div class="product-price">
              <span class="current-price">${formatPrice(
                product.currentPrice
              )}</span>
              <span class="original-price">${formatPrice(
                product.originalPrice
              )}</span>
            </div>
            <div class="product-description">
              <h2>Đặc điểm nổi bật</h2>
              <ul>
                <li>Chất liệu: ${product.material}</li>
                <li>Thương hiệu cao cấp</li>
                <li>Thiết kế hiện đại, sang trọng</li>
                <li>Sản xuất tại Việt Nam</li>
              </ul>
            </div>
            <div class="quantity-selector">
              <h2>Số Lượng:</h2>
              <div class="quantity-controls">
                <button onclick="decreaseQuantity()" class="quantity-btn">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <input id="quantity" type="number" value="1" min="1" readonly>
                <button onclick="increaseQuantity()" class="quantity-btn">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
              <i class="fa-solid fa-cart-plus"></i> Thêm Vào Giỏ Hàng
            </button>
          </div>
        </div>
      </div>`;
    document.getElementById("product-detail").innerHTML = html;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("product-detail").innerHTML = `
      <div class="error-container">
        <h2>Có lỗi xảy ra</h2>
        <p>${error.message}</p>
        <a href="index.html" class="back-btn">Quay về trang chủ</a>
      </div>`;
  }
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
  const quantity = parseInt(document.getElementById("quantity")?.value) || 1;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  console.log(cart);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
  alert("Đã thêm sản phẩm vào giỏ hàng!");
}

// Hiển thị sản phẩm trong giỏ hàng
async function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsList = document.getElementById("cart-items-list");

  // Kiểm tra nếu giỏ hàng trống
  if (cart.length === 0) {
    if (cartItemsList) cartItemsList.innerHTML = "<li>Giỏ Hàng Trống</li>";
    return;
  }

  cartItemsList.innerHTML = ""; // Xóa nội dung cũ

  // Lặp qua các sản phẩm trong giỏ hàng
  for (const item of cart) {
    try {
      const response = await fetch(
        `http://localhost:3000/products/${item.productId}`
      );
      const product = await response.json();

      // Tạo HTML hiển thị sản phẩm trong giỏ hàng
      const itemHTML = `
        <li class="cart-item">
          <div class="cart-item-info">
            <img src="../${product.image}" alt="${
        product.title
      }" class="cart-item-image">
            <div>
              <a href="product-detail.html?id=${
                product.id
              }" class="cart-item-title">${product.title}</a>
              <p class="cart-item-quantity">Số lượng: ${item.quantity}</p>
              <p class="cart-item-price">${formatPrice(
                product.currentPrice * item.quantity
              )}</p>
            </div>
          </div>
          <button onclick="removeFromCart(${
            item.productId
          })" class="cart-item-remove">Xóa</button>
        </li>`;
      if (cartItemsList) cartItemsList.innerHTML += itemHTML;
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.productId !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// Tăng giảm số lượng trong chi tiết sản phẩm
function increaseQuantity() {
  const quantityInput = document.getElementById("quantity");
  quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decreaseQuantity() {
  const quantityInput = document.getElementById("quantity");
  if (parseInt(quantityInput.value) > 1) {
    quantityInput.value = parseInt(quantityInput.value) - 1;
  }
}
// Lọc sản phẩm theo danh mục
async function filterProductsByCategory() {
  try {
    const selectedCategory = document.getElementById("category-select").value;
    const response = await fetch("http://localhost:3000/products");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const products = await response.json();

    const filteredProducts =
      selectedCategory === "all"
        ? products
        : products.filter(
            (product) => product.categoryId === parseInt(selectedCategory)
          );

    createProductHTML(filteredProducts);
  } catch (error) {
    console.error("Error filtering products:", error);
    document.getElementById("product-container").innerHTML = `
      <div class="error-message">
          <p>Không thể lọc sản phẩm. Vui lòng thử lại sau.</p>
      </div>
    `;
  }
}

// Khởi chạy
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.includes("product-detail.html")) {
    getProductDetail();
  } else {
    fetchProducts();
  }
  updateCartCount();
});

// Hàm tìm kiếm sản phẩm
function searchProducts() {
  const searchQuery = document
    .getElementById("search-input")
    .value.toLowerCase();
  fetch("http://localhost:3000/products") // Thay bằng URL của JSON Server nếu khác
    .then((response) => response.json())
    .then((products) => {
      const results = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery)
      );
      displaySearchResults(results);
    })
    .catch((error) => console.log("Error fetching products:", error));
}

// Hàm hiển thị kết quả tìm kiếm
function displaySearchResults(products) {
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = ""; // Xóa kết quả trước đó

  if (products.length > 0) {
    products.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.className = "product-item";
      productElement.innerHTML = `
              <img src="${product.image}" alt="${product.title}">
              <h3><a href="product-detail.html?id=${
                product.id
              }" class="cart-item-title">${product.title}</a></h3>
              <p>${product.material}</p>
              <p>${product.currentPrice.toLocaleString()}đ
                  <span style="text-decoration: line-through;">${product.originalPrice.toLocaleString()}đ</span>
              </p>
          `;
      resultsContainer.appendChild(productElement);
    });
  } else {
    resultsContainer.innerHTML = "<p>Không tìm thấy sản phẩm phù hợp.</p>";
  }
}

// Lắng nghe sự kiện nhập liệu trong ô tìm kiếm
document
  .getElementById("search-input")
  .addEventListener("input", searchProducts);

function displaySearchResults(products) {
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = ""; // Xóa kết quả cũ

  if (products.length > 0) {
    resultsContainer.classList.add("active"); // Hiển thị kết quả
    products.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.className = "product-item";
      productElement.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <h3>
            <a href="client/product-detail.html?id=${
              product.id
            }" class="cart-item-title">
              ${product.title}
            </a>
          </h3>
          <p>${product.currentPrice.toLocaleString()}đ</p>
        `;
      resultsContainer.appendChild(productElement);
    });
  } else {
    resultsContainer.innerHTML = "<p>Không tìm thấy sản phẩm phù hợp.</p>";
  }

  // Ẩn kết quả nếu không có sản phẩm
  if (products.length === 0) {
    resultsContainer.classList.remove("active");
  }
}
