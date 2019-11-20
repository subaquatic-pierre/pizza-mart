# Project 3

Web Programming with Python and JavaScript

This project is created for a pizza company. It allows online ordering and allows admins to create new items which can be added to the
menu. Admins can check a full list of orders which have been place already and also view individual orders. Alot have time has 
been spend on the front end of the webpage making the page more dynicmic with front-end javascript. The javascript adds event listeners
to al menu items, it opens up a modal which allows choices of pizza toppings from a list which can be added from or deleted from.
Once a item has been selected with its toppings the item is added to a javascript object. This object is then added to a cart which is 
itself a javascript object. Once all items have been selected the object is sent to the server using an invisible form. The request is then
checked against the database, once a user has confirmed their delivery address an order is added to the database and user is redirected to their 
order with a message which says successfull order placement.

## Added Feature
- Allow admins to upload a file which can be used to populate the DB with products
- Modal for choosing Toppings which uses JS event listeners to move items between 2 lists

## Requirements
- Bootstrap is used for styling along with Jquery
- Most javascript is vanilla JS
- Crispyforms are used to display style forms
- Handbars tempaltes used to display JS templates

## Apps

### Products

This apps holds the models for all the products which are to be added to the database. 

#### Adding items to database
1. Admin can login and add items through admin interface
2. Upload CSV file with pizza items (a template exists iin project root folder, make sure filename matches current filename)
    - Enter django shell
    - use import_items function
        ```python
        from products.import_items import import_items()
        import_items()
        
        ```
#### Displaying Items
All items are queried from the data base and prented on index.html page

#### Choosing Items
Once logged in users can choose anytime on the page by clicking on it, this will open dialog box if toppings are avaialable

#### Checkout
once users have completed adding items the will procceed to checkout by using the chekout button

### Orders

Once a user has proceeded to checkout they will be takken to their cart where they will confirm their deilivery address and submit order

### Uders

A user can register / login / logout using django auth system. All views are class based views.
