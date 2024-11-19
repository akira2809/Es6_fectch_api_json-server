"use strict";

let products = []; // Biến toàn cục để lưu trữ sản phẩm
let categories = []; // Biến toàn cục để lưu trữ danh mục

async function fetchData() {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch("http://localhost:3000/products"),
      fetch("http://localhost:3000/categories"),
    ]);

    if (!productsResponse.ok || !categoriesResponse.ok) {
      throw new Error(
        `HTTP error! status: ${productsResponse.status}, ${categoriesResponse.status}`
      );
    }

    products = await productsResponse.json();
    categories = await categoriesResponse.json();

    displayProducts(products, categories);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function displayProducts(products, categories) {
  const productTable = document.getElementById("product-admin");

  productTable.innerHTML = `
    <thead>
        <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Material</th>
            <th>Current Price</th>
            <th>Original Price</th>
            <th>Category</th>
            <th>Details</th>
            <th>Edit</th>
            <th>Delete</th>
        </tr>
    </thead>
    <tbody>
        ${products
          .map(
            (product) => `
            <tr>
                <td><img src="../${product.image}" alt="${
              product.title
            }" width="50"></td>
                <td>${product.title}</td>
                <td>${product.material}</td>
                <td>${formatCurrency(product.currentPrice)}</td>
                <td>${formatCurrency(product.originalPrice)}</td>
                <td>${getCategoryName(product.categoryId, categories)}</td>
                <td><a href="${product.url}?id=${product.id}">View</a></td>
                <td><button onclick="editProduct(${
                  product.id
                })">Edit</button></td>
                <td><button onclick="deleteProduct(${
                  product.id
                })">Delete</button></td>
            </tr>
          `
          )
          .join("")}
    </tbody>
  `;
}

function formatCurrency(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function getCategoryName(categoryId, categories) {
  const category = categories.find(
    (cat) => parseInt(cat.id) === parseInt(categoryId)
  );
  return category ? category.title : "Unknown";
}

document.addEventListener("DOMContentLoaded", fetchData);

async function editProduct(productId) {
  let editForm = document.getElementById("edit-form");
  let response = await fetch(`http://localhost:3000/products/${productId}`);
  let productEdit = await response.json();

  if (!editForm) {
    editForm = document.createElement("div");
    editForm.id = "edit-form";
    editForm.innerHTML = `
      <label>Product ID: <input type="text" id="edit-id" readonly></label>
      <label>Title: <input type="text" id="edit-title"></label>
      <label>Material: <input type="text" id="edit-material"></label>
      <label>Current Price: <input type="number" id="edit-current-price"></label>
      <label>Original Price: <input type="number" id="edit-original-price"></label>
      <label>Category: 
        <select id="edit-category">
          ${categories
            .map((cat) => `<option value="${cat.id}">${cat.title}</option>`)
            .join("")}
        </select>
      </label>
      <button onclick="saveProduct()">Save</button>
      <button onclick="cancelEdit()">Cancel</button>
    `;
    document.body.appendChild(editForm);
  }

  document.getElementById("edit-id").value = productEdit.id;
  document.getElementById("edit-title").value = productEdit.title;
  document.getElementById("edit-material").value = productEdit.material;
  document.getElementById("edit-current-price").value =
    productEdit.currentPrice;
  document.getElementById("edit-original-price").value =
    productEdit.originalPrice;
  document.getElementById("edit-category").value = productEdit.categoryId;

  editForm.setAttribute("data-product-id", productId);
}

async function saveProduct() {
  const editForm = document.getElementById("edit-form");
  const productId = editForm.getAttribute("data-product-id");

  const title = document.getElementById("edit-title").value;
  const material = document.getElementById("edit-material").value;
  const currentPrice = parseInt(
    document.getElementById("edit-current-price").value
  );
  const originalPrice = parseInt(
    document.getElementById("edit-original-price").value
  );
  const categoryId = parseInt(document.getElementById("edit-category").value);
  let productFetch = await fetch(`http://localhost:3000/products/${productId}`);
  productFetch = await productFetch.json();
  console.log(productFetch);
  let productEdit = {
    ...productFetch,
    title,
    material,
    currentPrice,
    originalPrice,
    categoryId,
  };
  try {
    const response = await fetch(
      `http://localhost:3000/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productEdit),
      }
    );

    if (response.ok) {
      const updatedProduct = {
        id: parseInt(productId),
        title,
        material,
        currentPrice,
        originalPrice,
        categoryId,
      };

      const productIndex = products.findIndex(
        (prod) => prod.id === updatedProduct.id
      );
      if (productIndex !== -1) {
        products[productIndex] = updatedProduct;
      }

      displayProducts(products, categories);
      cancelEdit();
    } else {
      console.error("Error updating product:", response.status);
    }
  } catch (error) {
    console.error("Error saving product:", error);
  }
}

function cancelEdit() {
  const editForm = document.getElementById("edit-form");
  if (editForm) {
    document.body.removeChild(editForm);
  }
}

async function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const response = await fetch(
        `http://localhost:3000/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        products = products.filter((prod) => prod.id !== productId);
        displayProducts(products, categories);
      } else {
        console.error("Error deleting product:", response.status);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
}
