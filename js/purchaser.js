$(document).ready(
    function(){
        var loading_screen = document.getElementById("loading_screen");

        //-----------------------------------------------------------------------------------------
        //Enabling the functionality to view each products
        var products_list_view = document.getElementById("products_list");
        var all_products_containers = products_list_view.getElementsByClassName("product");
        for(var c = 0; c < all_products_containers.length; c++){
            var view_item_btn = all_products_containers[c].getElementsByClassName("product_purchase_btn")[0];

            view_item_btn.addEventListener("click", (event) => {
                view_product(event.target.id);
            });
        }
        
        //-----------------------------------------------------------------------------------------
        //Enabling the functionality to view the Cart
        var docked_view_cart_btn = document.getElementById("docked_view_cart_btn");
        docked_view_cart_btn.addEventListener("click", ()=>{
            show_cart();
        });

        //-----------------------------------------------------------------------------------------
        //get the product data from the simulated "backend"
        var get_product = (product_id) => {
            loading_screen.style.display = "block";//show loading screen
            
            return new Promise((resolve, reject)=> {
                var products_request = new XMLHttpRequest();

                products_request.onreadystatechange = function(){
                    if(this.readyState === 4){//gotten feedback
                        if(this.status === 200){//received success feedback
                            loading_screen.style.display = "none";//hide loading screen

                            var all_products = JSON.parse(this.responseText);

                            var product = all_products.find((item) => {
                                return item.product_id === product_id;
                            });

                            resolve(product);
                        }
                        else{
                            loading_screen.style.display = "none";//hide loading screen
                            reject("Failed to load the products.");
                        }
                    }
                }
                products_request.open("GET", "./data/products.json", true);
                products_request.send();
            });
        }

        var view_product = async (product_id) => {
            // var website_body = document.getElementsByTagName("body")[0];
            var product_view_window;

            const product = await get_product(product_id);//get the product object using the passed id.

            var _cart_item = new Cart_item(product, 1);//initialise the product as a prospective cart item also and set the quantity to 1 by default
            _cart_item.quantity = cart.item_exist_in_cart(_cart_item)? cart.cart_items[cart.get_cart_item_index(_cart_item)].quantity : 1;//if the item already exists in the cart, change the quantity to what is already there, else leave it as 1

            //We have to display the product var 
            product_view_window = document.createElement("div");
            product_view_window.classList.add("secondary_page");

            //load the window into the created div using AJAX
            var show_product_view_window = async () => {//using asyn function here because we have to wait till the page elements are successfuly loaded before we continue with viewing the project
                const page_response_object = await load_secondary_page("./product_info_page.html");

                product_view_window.innerHTML = page_response_object.page;
                website_body.appendChild(product_view_window);//load the newly created container to display the product

                if(page_response_object.loaded_successfully){
                    //product viewing window is ready
                    var product_name_element = document.getElementById("product_focus_name");//get the element that displays the name of the product in focus
                    var product_description_element = document.getElementById("product_focus_decription");//get the element that displays the description of the product in focus
                    var product_price_element = document.getElementById("product_focus_price");//get the element that displays the price of the product in focus
                    var product_image_element = document.getElementById("product_focus_image_container");//get the element that displays the image of the product in focus

                    product_name_element.innerHTML = product.product_name;
                    product_description_element.innerHTML = product.product_description;
                    product_price_element.innerHTML = "$ " + product.product_price;
                    product_image_element.style.backgroundImage = `url("${product.product_image}")`;

                    //check if the items is already in the cart, if so fetch the quantity, else assign 1 as the quantity. ALso, fetch the quantithy increase and decrease buttons
                    var ordered_qty_displayer = document.getElementById("order_qty_text");
                    ordered_qty_displayer.innerHTML = _cart_item.quantity;//show the quantity of the cart_prospect_item

                    var add_2_cart_btn = document.getElementById("add_2_cart_btn");//get the button for putting item into cart
                    add_2_cart_btn.addEventListener("click", () => {
                        if(cart.add_To_Cart(_cart_item)){//add item to cart and close the product viewer if the item was addedd successfully
                            close_product_view_window();
                        }
                    });

                    var order_qty_redc_mod_btn = document.getElementById("order_qty_redc_mod_btn");
                    var order_qty_incr_mod_btn = document.getElementById("order_qty_incr_mod_btn");
                    
                    order_qty_incr_mod_btn.addEventListener("click", () => {//for increasing the item's quantity to order
                        _cart_item.quantity++;
                        ordered_qty_displayer.innerHTML = _cart_item.quantity;//view the quantity

                        add_2_cart_btn.disabled = false;//Keep the item order button enabled
                        order_qty_redc_mod_btn.disabled = false;//Keep the button enabled
                    });

                    order_qty_redc_mod_btn.addEventListener("click", () => {//for reducing the item's quantity to order
                        if(_cart_item.quantity > 0){
                            _cart_item.quantity--;
                            ordered_qty_displayer.innerHTML = _cart_item.quantity;//view the quantity
                        }
                        
                        if(_cart_item.quantity <= 0){
                            order_qty_redc_mod_btn.disabled = true;//disable this button
                            add_2_cart_btn.disabled = true;//disable the item order button
                            if(cart.item_exist_in_cart(_cart_item)){
                                cart.remove_from_Cart(_cart_item);//REMOVE THE ITEM FROM CART
                            }
                        }
                    });

                    //to enable us close the window when its no more needed
                    var window_close_btn = product_view_window.getElementsByClassName("menu_closure_btn")[0];
                    window_close_btn.addEventListener("click", () => close_product_view_window());
                }
            }

            show_product_view_window();

            var close_product_view_window = () => {
                if(website_body.contains(product_view_window)){
                    product_view_window.remove();
                }
            }
        }

        //---------------------------------------------------------
        //the function below handles AJAX call for loading any secondary webpage we need
        var load_secondary_page = (page_url) =>{
            loading_screen.style.display = "block";//show loading screen

            var page_request_response = {
                page: "",
                loaded_successfully: false
            }

            return new Promise((resolve, reject)=>{//we are returning a Promise here because the async await function (which we'll use to wait until the function is done) relies on promises to work
                var page_request = new XMLHttpRequest();

                page_request.onreadystatechange = function(){
                    if(this.readyState === 4){
                        if(this.status === 200){
                            //page data successfully loaded
                            loading_screen.style.display = "none";//hide loading screen

                            page_request_response.page = page_request.responseText;
                            page_request_response.loaded_successfully = true;

                            resolve(page_request_response);
                        }
                        else{
                            loading_screen.style.display = "none";//hide loading screen
                            console.log(new Error("Error loading page."));
                            
                            // page_request_response.page = `<div style="background-color: gray; width: 100%; height: 100vh; text-align: center; font-weight: bolder">Error loading page. <br> ERROR ${page_request.status}</DIV>`;
                            page_request_response.page = `Failed to Load. ERROR ${page_request.status}`
                            page_request_response.loaded_successfully = false;

                            // resolve(page_request_response);
                            reject(page_request_response);
                        }
                    }
                };

                page_request.open("GET", page_url, true);
                page_request.send();
            });
        }

        //-----------------------------------------------------------
        //Working with the Cart

        class Cart_item {
            constructor(product, quantity){
                this.product = product;
                this.quantity = quantity;
            }

            get_object_form = () => {
                return {
                    product: this.product,
                    quantity: this.quantity
                }
            }
        }

        class Cart{
            constructor(){
                // this.cart_items = [];
            }

            cart_items = [];

            item_exist_in_cart = (cart_item) => {
                for(var c = 0; c < this.cart_items.length; c++){
                    if(cart_item.product.product_id === this.cart_items[c].product.product_id){
                        return true;
                    }
                    else if(c === this.cart_items.length.length - 1){//if we are on the last iteration and we get here, then return false because item is not included in the cart
                        return false
                    }
                }
            }

            get_cart_item_index = (cart_item) => {
                return this.cart_items.findIndex((item) => {
                    return cart_item.product.product_id === item.product.product_id;
                });
            }

            add_To_Cart = (cart_item) => {
                if(cart_item.quantity > 0){//don't add item to cart, if it's quantity is not more that 0
                    //lets first check if the item already exists in the cart
                    if(this.item_exist_in_cart(cart_item)){//if it exists, only update the quantity
                        this.cart_items[this.get_cart_item_index(cart_item)].quantity = cart_item.quantity;
                        show_notification("Cart has been successfully updated.", true);
                    }
                    else{
                        //if item does not exist in the cart already, add it
                        //convert the prospective cart item constructor to object. Our cart should only accept objects
                        this.cart_items.push(cart_item.get_object_form());
                        show_notification("Item has been successfully added to the cart.", true);
                    }

                    //show the current total cart items count
                    update_docked_cart_volume_notifier();

                    //item successfully added to cart
                    return true;
                }
                else{
                    console.log(new Error("[Attempted to add item to cart] Error: Cannot add item with 0 quantity."));
                    show_notification("Error: Cannot add item with 0 quantity.", false);
                    return false;
                }
            }

            remove_from_Cart = (cart_item) => {
                if(this.item_exist_in_cart(cart_item)){//lets first check if the item already exists in the cart
                    this.cart_items.splice(this.get_cart_item_index(cart_item), 1);//remove item from the cart
                    
                    //show the current total cart items count
                    update_docked_cart_volume_notifier();
                    
                    show_notification("Item has been successfully removed from the cart.", true);
                }
                else{
                    console.log(new Error("[Attempted to remove item from cart] Error: item does not exist in the cart."));
                    show_notification("Error: item does not exist in the cart.", false);
                }
            }

            get_Items_Total_Cost = () => {
                var total_items_cost = this.cart_items.reduce((accumulator, item) => {
                    return accumulator + (item.product.product_price * item.quantity);
                }, 0);

                return total_items_cost;
            }

            get_Coupon_Discount_Value = () => {
                return 0 * this.get_Items_Total_Cost();
            }

            get_Charged_Sales_Tax = () => {
                return 0.05 * (this.get_Items_Total_Cost() - this.get_Coupon_Discount_Value());
            }

            get_Grand_Total_Cost = () => {
                return (this.get_Items_Total_Cost() - this.get_Coupon_Discount_Value()) + this.get_Charged_Sales_Tax();
            }
        }

        const cart = new Cart();

        var update_docked_cart_volume_notifier = () => {//this is the green bar that shows at the bottom of the page when there is at least 1 item in the cart
            var cart_items_qty_count = cart.cart_items.reduce((total_count, item) => {
                return total_count + item.quantity;
            }, 0);

            var docked_notifier = document.getElementById('docked_cart_notifier');
            docked_notifier.style.display = cart_items_qty_count > 0? "flex" : "none";//if the cart is empty, stop displaying this element

            var message_displayer = docked_notifier.getElementsByTagName("p")[0];
            message_displayer.innerHTML = `You have ${cart_items_qty_count} items in the cart.`;
        }

        var show_cart = () => {
            //VIEW CART WINDOW
            var opened_cart_window = document.createElement("div");
            opened_cart_window.classList.add("secondary_page");//adding this class will make the window fixed

            var show_cart_window = async () => {
                const page_response_object = await load_secondary_page("./cart_view_page.html");

                opened_cart_window.innerHTML = page_response_object.page;
                website_body.appendChild(opened_cart_window);

                if(page_response_object.loaded_successfully){
                    //now that the cart window is loaded
                    //list the items in the cart in the section for viewing them
                    var cart_items_view_container = document.getElementById("cart_items_container");
                    
                    cart.cart_items.forEach((item) => {
                        var cart_item = document.createElement("div");
                        cart_item.classList.add("cart_item");

                        cart_item.innerHTML = `
                        <img src="${item.product.product_image}" alt="${item.product.product_name}" width="50px">
                        <div>
                            <p class="descriptive_text_light item_name italisize"><b>${item.product.product_name}</b></p>
                            <p class="descriptive_text_light item_cost">$${item.product.product_price}</p>
                            <p class="descriptive_text_light item_quantity">Qty: ${item.quantity}</p>
                        </div>
                        <button class="link_button link_button_white item_del_btn"><i class="fa-solid fa-trash"></i></button>`

                        item_del_btn = cart_item.getElementsByClassName("item_del_btn")[0];
                        item_del_btn.onclick = () => {
                            cart.remove_from_Cart(item);
                            view_cost_summary();//reshow the current cost summary since an item was removed from the cart
                            // cart_item.remove();
                            cart_items_view_container.removeChild(cart_item);

                            if(cart.cart_items.length <= 0){
                                close_cart_window();
                            }
                        };

                        cart_items_view_container.appendChild(cart_item);
                    });

                    //viewing the cost summaries of the cart
                    var view_cost_summary = () => {
                        var items_total_cost_viewer = document.getElementById("items_total_cost_viewer");
                        items_total_cost_viewer.innerHTML = `$${cart.get_Items_Total_Cost().toFixed(2)}`;

                        var discount_viewer = document.getElementById("discount_viewer");
                        discount_viewer.innerHTML = `$${cart.get_Coupon_Discount_Value().toFixed(2)}`;

                        var sales_tax_viewer = document.getElementById("sales_tax_viewer");
                        sales_tax_viewer.innerHTML = `$${cart.get_Charged_Sales_Tax().toFixed(2)}`;

                        var grand_total_viewer = document.getElementById("grand_total_viewer");
                        grand_total_viewer.innerHTML = `$${cart.get_Grand_Total_Cost().toFixed(2)}`
                    }

                    view_cost_summary();

                    //to enable us close the window when its no more needed
                    var window_close_btn = opened_cart_window.getElementsByClassName("menu_closure_btn")[0];
                    window_close_btn.addEventListener("click", () => close_cart_window());

                    var order_completion_form = document.getElementById("buyer_details_form");
                    order_completion_form.addEventListener("submit", (e) => {
                        // e.preventDefault();//this function call prevents the form from performing its default action (loading a given page, embedding the form data into the URL, etc.)
                        //"Form submit clicked..."
                        //send data to the back end using "POST" request through AJAX (XMLHttpRequest).
                        //Since there is no backend to handle the request, i have put the url of the order completion page into the "action" attribute of the HTML form with "GET" request type
                    });
                }
            }

            show_cart_window();

            var close_cart_window = () => {
                if(website_body.contains(opened_cart_window)){
                    opened_cart_window.remove();
                }
            }
        }
    }
);