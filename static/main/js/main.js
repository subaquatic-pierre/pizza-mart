document.addEventListener('DOMContentLoaded', function() {
    var cartItem, itemPriceLarge, itemPriceSmall, itemName, selectedToppings, itemPrice, itemQty, cartIndex, itemCat, optionsLeft, itemSize;
    // cart item variables
    var cart = new Object
    cartIndex = 0;
    // set open the modal to false
    // check if user has local storage
    // set cart index to local storage or 0
    if (!localStorage.getItem('cart')) {
        cartIndex = 0; 
    } else {
        cart = JSON.parse(localStorage.getItem('cart'))
        if (Object.keys(cart).length === 0) {
            cartIndex = 0;
        } else {
            cartIndex = Object.keys(cart).length;                   
        }
    } 
    // build cart on checkout page
    if (window.location.pathname === '/orders/checkout/') {
        buildCart();
    }
    
    // Make sure on indexpage 
    if (window.location.pathname === '/'){   
        var csrftoken = getCookie('csrftoken')
        // set modal not open     
        var modal = false;            

        // build cart on page load
        buildCart();

        // Pizza event listeners
        pizzaItemRow.forEach(e => {
            e.addEventListener('click', function(){    
                // Check if modal opened before, reset if so
                if (modal === true) {
                    resetModal();
                }
                // modal opend set to true
                modal = true;

                // get item name and category from item row click
                // could get all info from HTML
                itemName = this.children[0].innerHTML; 
                itemCat = this.parentElement.parentElement.dataset.category;     

                // check not cheese pizza otherwise do no t show topping options
                if ((this.children[0].innerHTML === 'Cheese' && (itemCat === 'Sicilian Pizza' || itemCat === 'Regular Pizza')) || itemCat === 'Dinner Platters'){
                    document.getElementById('topping-row').hidden = true;
                } else {
                    document.getElementById('topping-row').hidden = false;
                }

                /* 
                Query server for pizza item from DB, 
                ** no need to query database, could get values from datasets,
                from with html elements when first loading page,
                paracticing making AJAX requests to the server
                */
                
                request = new XMLHttpRequest();
                request.open('POST', '/getpizza/')
                request.onload = function () {
                    // Render option handlebar template on server response
                    const data = JSON.parse(request.responseText)

                    // Get prices from DB
                    if (itemName != 'Sausage, Peppers and Onions'){
                        itemPriceSmall = data.small.price;
                    }
                    itemPriceLarge = data.large.price;
                    // Set options left variable used for number of toppings to choose
                    optionsLeft = data.large.toppings;

                    // Change modal title to pizza name
                    $('#modalTitle').text(`${itemName} - ${itemCat}`)
                    $('#options-left').text(`Options left: ${optionsLeft}`)

                    // toppings array
                    selectedToppings = [] 
                    
                    // Check if sub and only add few toppings
                    if (itemCat === 'Subs') {
                        // Steak and chees has most options for subs
                        if (itemName === 'Steak + Cheese') {
                            var subToppings = [
                                'Extra Cheese',
                                'S + C + Onions',
                                'S + C + Green Peppers',
                                'S + C + Mushrooms'
                            ]
                        } else {
                            var subToppings = [
                                'Extra Cheese'
                            ]
                        }             
                        // Add sub topping items to topping list
                        subToppings.forEach(item => {
                            buildToppingList(item)  
                        })   
                    } else { // else itt is a pizza and add all toppings
                        // Add database if pizza topping items to topping list
                        allToppings.forEach(item => {
                            buildToppingList(item)                              
                        })   
                    }
                }
                // AJAX request to server
                // create new form instance to send to server
                data = new FormData()
                // insert form data for selected pizza name
                request.setRequestHeader("X-CSRFToken", csrftoken);
                data.append('itemName', itemName)
                data.append('category', itemCat)
                // send selected pizza to DB
                request.send(data)

                // Show topping option modal on item click
                $('#optionsModal').modal('show')
            })
        });    

        // Add listener to other items
        itemRow.forEach(row => {
            row.addEventListener('click', function (){
                item = this.dataset.name;
                itemCat = this.dataset.category;
                itemPrice = this.dataset.price;
                itemSize = 'Large';
                selectedToppings = [];
                // Add item to cart or update quantity if already in cart
                // Values is object with returned values from addCartItem function
                let values = addCartItem(item, cart, cartIndex, itemCat, itemPrice, itemSize);
                cart = values.cart
                cartIndex = values.index                
                // build cart from cart object
                cartHtml.innerHTML = '';      

                buildCart()            
                // SET LOCAL STORAGE ON ADD ITEM TO CART MODAL BUTTON
                localStorage.setItem('cart', JSON.stringify(cart))
            });
        });

        // add to cart from add to cart button in options modal
        document.querySelector('#modalCartAdd').addEventListener('click', () => {
            var nosize = true;
            // check that onesize is chosen
            for(let i = 0; i < sizeRadio.length; i++){
                if (sizeRadio[i].checked === true && sizeRadio[i].value === 'large') {
                    itemPrice = itemPriceLarge;
                    itemSize = 'Large';
                    nosize = false;
                    break;
                    } else if (sizeRadio[i].checked === true && sizeRadio[i].value === 'small') {
                    itemPrice = itemPriceSmall;
                    itemSize = "Small";
                    nosize = false;
                    break;
                    }          
                } 
            if (nosize === true) {
                alert('Pizza size must be chosen');
                return 1;
            }

            // reset modal html
            resetModal()
            cartHtml.innerHTML = '';       
        
            // Add item to cart or update quantity if already in cart
            // Values is object with returned values from addCartItem function
            let values = addCartItem(itemName, cart, cartIndex, itemCat, itemPrice, itemSize);
            cart = values.cart
            cartIndex = values.index
            
            // build cart from cart object
            buildCart()            

            // SET LOCAL STORAGE ON ADD ITEM TO CART MODAL BUTTON
            localStorage.setItem('cart', JSON.stringify(cart))
            $('#optionsModal').modal('hide')     
        })

        // go to cart button, make sure user is logged in to set event listener
        if (username != undefined){
            document.getElementById('cart-col').setAttribute('class', 'col-md-12 mt-2 bg-success')
            
            document.querySelector('#index-checkout').onclick = () => {
                if (Object.keys(cart).length === 0){
                    alert('Your cart is empty');
                    return 1;
                }
                let form = document.createElement('form');
                form.action = 'orders/checkout/'; 
                form.method = 'post';
                let input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'data';
                input.value = JSON.stringify(cart);
                let token = getCookie('csrftoken');
                let csrf = document.createElement('input');
                csrf.type = 'hidden';
                csrf.name = 'csrfmiddlewaretoken';
                csrf.value = token
                form.append(input);
                form.append(csrf);    
                document.body.appendChild(form);
                form.submit();
            }            
        }   

        // cancel modal button
        document.querySelector('#modalCancel').addEventListener('click', () => {
            resetModal()
        })

        // Close modal button
        document.querySelector('#modalClose').addEventListener('click', () => {
            resetModal()
        })
    } // END if index page

    // post request to submit order to database
    if (window.location.pathname == '/orders/checkout/'){
        form = document.querySelector('#place-order')
        form.onsubmit = e => {
            e.preventDefault()
            if (Object.keys(cart).length === 0){
                alert('Your cart is empty');
                e.preventDefault()
                return 1;                
            }
            localStorage.removeItem('cart')
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'data';
            input.value = JSON.stringify(cart);
            form.append(input);
            form.submit()
        }
    }
    
    // add item to cart
    function addCartItem(item, cart, cartIndex, itemCat, itemPrice, itemSize){
        // evalutate number from cartIndex
        let i = 'item_' + eval(cartIndex);
        // add key to index of item in cart
        // first item needs to be object for rest to use dot notation
        // If item is a sub, add the price for extra toppings
        if (itemCat === 'Subs') {
            for(topping of selectedToppings) {
                itemPrice = parseFloat(itemPrice)
                itemPrice += 0.5
                itemPrice = itemPrice.toFixed(2)
            }
        }
        cart[i] = {name:item}
        cart[i].price = itemPrice
        cart[i].qty = 1;
        cart[i].toppings = selectedToppings;
        cart[i].category = itemCat
        cart[i].size = itemSize
        /*
        ** Practice code:
        Loop through object, get key and item with object[key]
        can use Object.values(object) but does not give key which 
        is need if want to located the item in the object
        */
        Object.keys(cart).forEach((keys, value) => {
            // console.log(`keys: ${keys}`)
            // console.log(`values: ${cart[keys].name}`)
        })
        // increment cart index 
        cartIndex += 1;
        // return object with cart and current index value
        return {cart:cart, index:cartIndex}
    }

    // update available topping list when user selects toppings
    // should be able to combine theses two functions
    // cant figure it out
    function updateToppings(toppings, item){
        var index = toppings.indexOf(item);
        if (index > -1) {
            toppings.splice(index, 1);
        } else {
            toppings.push(item)
        }
        return toppings.sort()
    }

    // update chosen toppings when user selects toppings
    function updateChosen(chosenToppings, item){
        var index = chosenToppings.indexOf(item);
        if (index > -1) {
            chosenToppings.splice(index, 1);
        } else {
            chosenToppings.push(item)
        }
        return chosenToppings.sort()
    }

    // reset modal
    function resetModal() {
        availToppings = [];
        allToppings.forEach(item => availToppings.push(item))
        modal = false;
        toppingList.innerHTML = '';
        chosenToppingList.innerHTML = '';
        optionsLeft = 0;
        // reset radio button
        sizeRadio.forEach(item => {
            item.checked = false;
        })
    }

    function buildCart() {
        // Handlebar templates
        const cartItemTemplate = Handlebars.compile(document.getElementById("cart-item-script").innerHTML);
        Object.keys(cart).forEach((key, value) => {
            // Cartsingle item cart template
            cartItem = document.createElement('div')            
            cartItem.setAttribute('class', 'list-group-item cart-item mb-2')
            // fill in context valriables to make up siignle cart item to be appended to cart
            let context = {
                category: cart[key].category,
                index: key,
                itemName: cart[key].name, 
                price: cart[key].price,
                toppings: cart[key].toppings,
                size: cart[key].size,
            }
            // create template with context
            cartItem.innerHTML = cartItemTemplate(context)
            // span delete button to remove item
            cartItem.children[0].addEventListener('click', function(){
                delete cart[this.dataset.index]
                this.parentElement.remove();

                // SET LOCAL STORAGE CART AFTER DELETE ITEM FROM CART
                cartIndex -= 1;
                localStorage.setItem('cart', JSON.stringify(cart))

            });
            // add item to HTML cart
            if (cartHtml){
                cartHtml.append(cartItem);
            }
        })     
    }

    function buildToppingList(item){
        // create list of toppings for each topping from the DB
        let class_name = 'list-group-item list-group-item-action topping-item'
        toppingListLi = document.createElement('a');
        toppingListLi.innerHTML = item;
        toppingListLi.setAttribute('class', class_name)
        toppingList.append(toppingListLi)

        // click listen, move to chosen toppings    
        toppingListLi.onclick = function() {                        
            if (this.parentElement.id === 'toppings-list') {
                // Alert and stop if allowed toppings exceeded
                if (optionsLeft <= 0) {
                alert(`Only ${data.large.toppings} toppings aloud`);
                    return 1;
                }

                // update chosen toppings available and chosen
                selectedToppings = updateChosen(selectedToppings, this.innerHTML)
                updateToppings(availToppings, this.innerHTML)
                
                // set class to chosen topping class
                let class_name = 'list-group-item list-group-item-action chosen-topping-item';
                this.className = class_name;

                // move it to chosen topping
                optionsLeft -= 1;
                $('#options-left').text(`Options left: ${optionsLeft}`)  
                chosenToppingList.append(this)
            } else { 
                // Move the toopings back to available toppings if removed from chosen list
                // update toppings available and chosen
                availToppings = updateToppings(availToppings, this.innerHTML)
                updateChosen(selectedToppings, this.innerHTML)

                //  set class to avaialable topping class
                let class_name = 'list-group-item list-group-item-action topping-item'
                this.className = class_name

                // Move it back to topping list
                optionsLeft += 1;
                $('#options-left').text(`Options left: ${optionsLeft}`)  
                toppingList.append(this)       

                // order toppings item list
                for (let i = 0; i < availToppings.length; i++){
                    toppingList.children[i].innerHTML = availToppings[i]
                }                 
            }                 
        }             
    }

    function getCookie(name) {
        var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }   
    
});

// Sleep funtion

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}