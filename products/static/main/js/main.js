document.addEventListener('DOMContentLoaded', function() {
    
    itemRow = document.querySelectorAll('#itemRow');
    cart = document.querySelector('#cart');
    let cartItem;

    // Handlebar templates
    let cartItemTemplate = Handlebars.compile(document.getElementById("cart-item-script").innerHTML);
    let modalChoiceTemplate = Handlebars.compile(document.getElementById("modal-choice-script").innerHTML);

    // Pizza event listeners
    itemRow.forEach(e => {
        e.addEventListener('click', function(){
            cartItem = document.createElement('li');
            itemName = this.childNodes[1].innerHTML;
            itemPriceSmall = this.childNodes[3].innerHTML;
            itemPriceLarge = this.childNodes[5].innerHTML;
            // Query server for pizza item from DB
            request = new XMLHttpRequest();
            request.open('POST', 'getpizza/')
            request.onload = () => {
                // Render option handlebar template on server response
                const data = JSON.parse(request.responseText)
                // Set options left variable used for number of toppings to choose
                let optionsLeft = data.large.toppings
                // Change modal title to pizza name
                $('#modalTitle').text(`${data.large.name}`)
                $('#options-left').text(`Options left: ${optionsLeft}`)
                // Add topping items to topping list
                data.toppings.forEach(item => {
                    li = document.createElement('a');
                    li.innerHTML = item;
                    li.setAttribute('class', 'list-group-item list-group-item-action')
                    document.querySelector('#toppings-list').append(li)
                    // click listen, move to chosen toppings
                        li.addEventListener('click', function() {
                            // Change and update options left
                            optionsLeft -= 1;
                            $('#options-left').text(`Options left: ${optionsLeft}`)
                            li = document.createElement('a');
                            li.innerHTML = item;
                            li.setAttribute('class', 'list-group-item list-group-item-action')
                            document.querySelector('#chosen-toppings-list').append(li)
                            // send it back if unchosen
                            li.addEventListener('click', function() {
                                // change and update options left
                                optionsLeft += 1;
                                $('#options-left').text(`Options left: ${optionsLeft}`);
                                li = document.createElement('a');
                                li.innerHTML = item;
                                li.setAttribute('class', 'list-group-item list-group-item-action')
                                document.querySelector('#toppings-list').append(li)                        
                                this.remove()  
                            })                        
                            this.remove()  
                        })
                })
            }
            data = new FormData()
            data.append('itemName', itemName)
            request.send(data)

            // Cart template
            context = {itemName: itemName, itemPriceSmall: itemPriceSmall, itemPriceLarge: itemPriceLarge}
            cartItem.setAttribute('class', 'list-group-item')
            cartItem.id = 'cartItem'
            cartItem.innerHTML = cartItemTemplate(context)
            cartItem.childNodes[1].addEventListener('click', function(){
                this.parentElement.remove();
            });





            // Show option modal on item click
            $('#optionsModal').modal('show')
        })
    });

    // add to cart button modal
    document.querySelector('#modalCartAdd').addEventListener('click', () => {
        document.querySelector('#chosen-toppings-list').innerHTML = '';
        document.querySelector('#toppings-list').innerHTML = '';
        cart.append(cartItem);
    })

    // cancel modal button
    document.querySelector('#modalCancel').addEventListener('click', () => {
        document.querySelector('#chosen-toppings-list').innerHTML = '';
        document.querySelector('#toppings-list').innerHTML = '';
    })

    // Close modal button
    document.querySelector('#modalClose').addEventListener('click', () => {
        document.querySelector('#chosen-toppings-list').innerHTML = '';
        document.querySelector('#toppings-list').innerHTML = '';
    })



});














// Sleep funtion

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}