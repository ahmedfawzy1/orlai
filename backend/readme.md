# Product and Review Management API

This API allows for the management of **products** and **reviews** in an e-commerce platform. It includes routes for creating, updating, deleting, and retrieving products, as well as adding, retrieving, and managing product reviews.

## Features

- Create, read, update, and delete products
- Search products by name, category, and price
- Manage product inventory
- Add and retrieve product reviews
- Rate products and leave comments for each product

## Installation

### Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or later)
- **MongoDB** (or use a cloud MongoDB service like MongoDB Atlas)

### Steps to Install and Run the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/ahmedfawzy1/orlai.git
   cd product-review-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your MongoDB connection:

   - If using MongoDB locally, make sure MongoDB is running
   - If using MongoDB Atlas, you can get your connection string from your MongoDB Atlas dashboard

4. Create a `.env` file and add the MongoDB connection string:

   ```
   MONGO_URI=mongodb://localhost:27017/product-review-api
   ```

   Or, if using MongoDB Atlas:

   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/product-review-api
   ```

5. Run the project:
   ```bash
   npm start
   ```

Your API will be running at http://localhost:5000 by default.

## API Documentation

### Routes

#### 1. Product Routes

##### Create a Product

- **POST** `/api/products`
- **Body:**
  ```json
  {
    "name": "Product Name",
    "description": "Product Description",
    "priceRange": [{ "maxVariantPrice": 100, "minVariantPrice": 80 }],
    "category": "Category",
    "inventory": 10,
    "availableForSale": true,
    "images": ["image1.jpg", "image2.jpg"],
    "variants": [{ "color": "Red", "size": "M", "stock": 5 }],
    "averageRating": 4.5,
    "slug": "product-name"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Product created successfully!",
    "product": { ... }
  }
  ```

##### Get All Products

- **GET** `/api/products`
- **Response:**
  ```json
  {
    "products": [ ... ],
    "total_count": 10
  }
  ```

##### Get Product by ID

- **GET** `/api/products/:id`
- **Response:**
  ```json
  {
    "_id": "productId",
    "name": "Product Name",
    "description": "Product Description",
    ...
  }
  ```

##### Update Product

- **PUT** `/api/products/:id`
- **Body:**
  ```json
  {
    "name": "Updated Product Name",
    "priceRange": [{"maxVariantPrice": 120, "minVariantPrice": 100}],
    ...
  }
  ```
- **Response:**
  ```json
  {
    "message": "Product updated successfully!",
    "product": { ... }
  }
  ```

##### Delete Product

- **DELETE** `/api/products/:id`
- **Response:**
  ```json
  {
    "message": "Product deleted successfully!"
  }
  ```

##### Search Products

- **GET** `/api/products/search`
- **Query Parameters:**
  - `name`
  - `category`
  - `min_price`
  - `max_price`
- **Response:**
  ```json
  {
    "products": [ ... ],
    "total_count": 5
  }
  ```

##### Update Product Inventory

- **PUT** `/api/products/:id/inventory`
- **Body:**
  ```json
  {
    "inventory": 50
  }
  ```
- **Response:**
  ```json
  {
    "message": "Product inventory updated successfully!",
    "product": { ... }
  }
  ```

#### 2. Review Routes

##### Create a Review for a Product

- **POST** `/api/products/:id/reviews`
- **Body:**
  ```json
  {
    "userName": "John Doe",
    "userEmail": "john.doe@example.com",
    "rating": 5,
    "comment": "Amazing product! Highly recommend."
  }
  ```
- **Response:**
  ```json
  {
    "message": "Review added successfully!",
    "review": { ... }
  }
  ```

##### Get All Reviews for a Product

- **GET** `/api/products/:id/reviews`
- **Response:**
  ```json
  {
    "reviews": [
      {
        "userName": "John Doe",
        "rating": 5,
        "comment": "Amazing product!"
      },
      ...
    ]
  }
  ```

##### Get All Reviews

- **GET** `/api/reviews`
- **Response:**
  ```json
  {
    "reviews": [
      {
        "userName": "John Doe",
        "rating": 5,
        "comment": "Amazing product!",
        "product": {
          "_id": "productId",
          "name": "Product Name"
        },
        "createdAt": "2021-07-01T12:00:00.000Z"
      },
      ...
    ]
  }
  ```

## Environment Variables

| Variable  | Description                                 |
| --------- | ------------------------------------------- |
| MONGO_URI | MongoDB connection string for your database |

## Example Data

### Create Product Example

```bash
POST /api/products
```

```json
{
  "name": "T-shirt",
  "description": "A comfortable t-shirt.",
  "priceRange": [{ "maxVariantPrice": 30, "minVariantPrice": 20 }],
  "category": "Clothing",
  "inventory": 100,
  "availableForSale": true,
  "images": ["image1.jpg", "image2.jpg"],
  "variants": [{ "color": "Blue", "size": "M", "stock": 50 }],
  "averageRating": 4.5,
  "slug": "t-shirt"
}
```

### Create Review Example

```bash
POST /api/products/60d2c085b8b1c1b29c0c1f6b/reviews
```

```json
{
  "userName": "Jane Smith",
  "userEmail": "jane.smith@example.com",
  "rating": 4,
  "comment": "Good product, but the size was a bit off."
}
```
