# Project: Frontend for E-commerce Website or Library Management System

The frontend interacts with mock data stored locally in the project. In the full-stack project, this data will be connected to the backend.

Please, do not spend time on creating your own server. use the files that are in the `./public/mock/*` We have the data ready for you. all you need is send an HTTP request to the resource. we also have an example on how to fetch all products and how to add one product. use them as a reference.

## Option 1: Library Management System

### Level 1: Basic Requirements

Tech Stack: React, TypeScript, and Redux/Redux Toolkit. Styling: CSS/SASS or MUI.

**Data Sources:**

- Books: id, image, title, description,author, isAvailable, bookCopiesQty
- Borrows: id, borrowerId, bookId, borrowDate, returnDate, dueDate
- Category: id, name
- Authors: id, name
- Users (as visitor or admin): id, firstName, lastName, email, password, role (visitor or admin)

**Pages to Create:**

1. Home page with a list of books
2. Page to show detailed of book
3. Admin Page

**Functionalities for a Visitor:**

- List of books
- Filter books by status
- Search by title or by author
- Borrow a book
- Return a borrowed book

**Functionalities for an Admin:**

- Add a new book, update info of a book, remove a book

**Deployment**

- Deploy the application to Netlify and update the README file with the project information

### Level 2: Additional Requirements

**Authentication:**

- Implement register and login functionality via email and password
- Protect the routes based on login and admin status

**Functionalities for an Admin:**

- list all users, delete or block a user.
- list all borrows
- Add a new author, update info of an author, remove an author

**Form Validation:**

- Implement form validation.

### Level 3: Bonus Requirement (Optional)

If you have a higher skill level and finish the previous requirements before the deadline, you can tackle the following bonus tasks:

- Messages, show loading, success, and error messages (e.g., when loading books list or adding new books)
- Implement pagination feature
- Create a Profile Page (only available if user logs in), implement editing user profile feature (user can change first name, last name)

- Peer Review:
- Review the code and implementation of 2 assignments from other participants.
- Provide constructive feedback and suggestions for improvement.

`Please note that the bonus requirements and reviews are optional and can be completed if you have additional time and advanced skills.`

Happy coding!

---

## Option 2: E-commerce Website

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

- Peer Review:
- Review the code and implementation of 2 assignments from other participants.
- Provide constructive feedback and suggestions for improvement.

`Please note that the bonus requirements and reviews are optional and can be completed if you have additional time and advanced skills.`

Happy coding!
