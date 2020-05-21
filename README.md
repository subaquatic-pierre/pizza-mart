# Welcome to The Pizza App

This project is created for a pizza company. It allows online ordering and allows admins to create new items which can be added to the
menu. Admins can check a full list of orders which have been placed already and also view individual orders. The javascript adds event listeners
to all menu items, it opens up a modal which allows choices of pizza toppings from a list which can be added from or deleted from.
Once a item has been selected with its toppings the item is added to a javascript object. This object is then added to a cart which is
itself a javascript object. Once all items have been selected the object is sent to the server using an invisible form. The request is then
checked against the database, once a user has confirmed their delivery address an order is added to the database and user is redirected to their
order with a message which says successful order placement.

## Dummy user data

- username: cooluser
- password: supersecretpassword

## Requirements

- Bootstrap is used for styling along with Jquery
- Most javascript is vanilla JS
- Crispyforms are used to display style forms
- Handlebars JS templates used to display JS templates

## Apps

### Products

This apps holds the models for all the products which are to be added to the database.

#### Adding items to database

1. Admin can login and add items through admin interface
2. Upload CSV file with pizza items (a template exists in the project root folder, make sure filename matches current filename)

   - Enter django shell
   - use import_items function

     ```python
     from products.import_items import import_items()
     import_items()

     ```

#### Displaying Items

All items are queried from the data base and presented on index.html page

#### Choosing Items

Once logged in users can choose anything on the page by clicking on it, this will open dialog box if toppings are available

#### Checkout

Once users have completed adding items they will proceed to checkout by using the checkout button

### Orders

Once a user has proceeded to checkout they will be taken to their cart where they will confirm their delivery address and submit the order

### Oders

A user can register / login / logout using django auth system. All views are class based views.
