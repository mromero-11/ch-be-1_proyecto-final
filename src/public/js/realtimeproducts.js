const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    
    //  fetch and update the product list
    const fetchProducts = () => {
        socket.emit('requestProducts');
    };

    //  initial product list
    fetchProducts();

    //  update the product list when data is received
    socket.on('updateProducts', (products) => {
        productList.innerHTML = '';
        products.forEach(product => {
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
    });

    //  handle form submission
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        //  collect form data
        const data = new FormData(productForm);
        const prod = {};
        data.forEach((value, key) => {
            if (key === 'price') {
                prod[key] = parseFloat(value);
            } else if (key === 'stock') {
                prod[key] = parseInt(value, 10);
            } else {
                prod[key] = value;
            }
        });
        console.log(prod);
        
        try {
            //  send POST request to create a new product using the API
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prod),
            });
            
            if (response.ok) {
                //  clear the form
                productForm.reset();
                
                //  refresh the product list via sockets
                fetchProducts();
            } else {
                console.error('Failed to add product');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
