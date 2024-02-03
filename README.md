# Full-Stack-SDA-Project-Ecommerce-Website-MERN-Stack

 # Project: Frontend for E-commerce Website

### (E-commerce Website)

### Level 1: Basic Requirements

Tech Stack: React, TypeScript, and Redux/Redux Toolkit. Styling: CSS/SASS or MUI.

**Data Sources:**

- Products: id, name, description, categories, variants, sizes
- Categories: id, name
- Orders: id, productId, userId, purchasedAt
- Users: id, firstName, lastName, email, password, role (visitor or admin)

**Pages to Create:**

1. Home page (list all the products)
2. Product page (contain the details of a product)
3. Admin page

**Functionalities for a Visitor:**

- Get list of products
- Filter products by categories or price
- Search products by name
- Add products to a cart
- Remove products from a cart

**Functionalities for an Admin:**

- Add a new product, update info of a product, remove a product

### Level 2: Additional Requirements

**Authentication:**

- Implement register and login functionality via email and password
- Protect the routes based on login and admin status

**Functionalities for an Admin:**

- list all users, delete or block a user.
- list all orders
- Add a new category, update info of a category, remove a category

**Form Validation:**

- Implement form validation.

### Level 3: Bonus Requirement (Optional)

If you have a higher skill level and finish the previous requirements before the deadline, you can tackle the following bonus tasks:

- Messages, show loading, success, and error messages (e.g., when loading products list or adding new product)
- Implement pagination feature
- Create a Profile Page (only available if user logs in), implement editing user profile feature (user can change first name, last name)

---------------------------------------------------------------------------------------------------------------

 # Project: Backend for E-commerce Website

This repository contains a Node.js/Express.js application with RESTful API endpoints for e-commerce application. The API allows you to interact with items in the products in the store.

`This is a teamwork assignment where you will work as a team within your group`
## How to work
1. One team member should fork the repo.
2. The other team members should clone the forked repo (your team member's forked repo).
3. All team members now work from the origin repository.
4. The member who forked the repo should open a PR 

Please ask your instructor or supporting instructor if you have any questions or need help.

## Level 1: Basic Requirements

In this level, the application includes the following features:

1. Create all the needed models for the backend to function.
2. Create routes to handle CRUD requests.
3. Implement a route to handle GET requests for fetching a specific item or product based on a unique identifier (e.g., item ID or product ID).

## Level 2: Additional Requirements

In addition to the basic requirements, the application enhances its functionality with the following features:

1. Include pagination functionality to retrieve items or products in batches or limit the number of items returned in a single request.
2. Implement a route to handle GET requests with query parameters for filtering items or products based on specific criteria (e.g., by category, price range).
3. Add validation checks to ensure the data meets certain criteria before performing create or update operations (e.g., validating required fields, data format) using Zod.
4. Create routes to handle GET requests to fetch items or products sorted in a specific order (e.g., by title, by date added).

## Level 3: Bonus Requirements (Optional)

If you have a higher skill level and finish the previous requirements before the deadline, you can tackle the following bonus tasks:

1. Implement search functionality to allow users to search for specific items or products based on keywords or specific fields (e.g., by title).
2. Integrate JWT authentication and authorization mechanisms to secure the API endpoints and restrict access to certain routes or operations.
3. Add functionality to handle related resources (e.g., for an e-commerce store, add routes for placing an order).

Happy coding!

## short Demo

https://github.com/Atheer-Almazrui/Full-Stack-SDA-Project-Ecommerce-Website-MERN-Stack/assets/119087772/10efcbc6-0742-4c14-8f1b-737cdecbdb91 


