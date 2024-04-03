const express = require('express');

const { URLSearchParams } = require('url');

const app = express();
const PORT = 3000;

const testServerURL = 'YOUR_TEST_SERVER_URL';

app.get('/categories/:categoryName/products', async (req, res) => {
    try {
        const { categoryName } = req.params;
        const { n, minPrice, maxPrice, sort } = req.query;

        const queryParams = new URLSearchParams({
            n: n || 10,
            minPrice,
            maxPrice,
            sort
        });

        const response = await fetch(`${testServerURL}/test/companies/ANZ/categories/${categoryName}/products/top-n?${queryParams}`);
        const data = await response.json();

        const processedData = data.map(product => ({
            id: generateUniqueId(),
            name: product.name,
            price: product.price,
            rating: product.rating,
            company: product.company,
            discount: product.discount
        }));

        res.json(processedData);
    } catch (error) {
        console.error('Error fetching top products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/categories/:categoryName/products/:productId', async (req, res) => {
    try {
        const { categoryName, productId } = req.params;

        const response = await fetch(`${testServerURL}/test/companies/ANZ/categories/${categoryName}/products/${productId}`);
        const productDetails = await response.json();

        res.json(productDetails);
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
