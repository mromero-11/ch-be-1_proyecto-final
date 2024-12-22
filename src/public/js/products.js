document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');

    //  loading
    productList.innerHTML = '<p>Loading products...</p>';

    //  fetch products from the API
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            productList.innerHTML = '';
            data.forEach(product => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h2>${product.title}</h2>
                    <h3>${product.description}</h3>
                    <p>Code: ${product.code}</p>
                    <p>Category: ${product.category}</p>
                    <p>Price: $${product.price}</p>
                    <p>Stock: ${product.stock}</p>
                `;
                productList.appendChild(li);
            });
        })
        .catch(err => {
            productList.innerHTML = '<p>Error loading products.</p>';
            console.error('Error fetching products:', err);
        });
});
