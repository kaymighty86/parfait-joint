var website_body;

$(document).ready(
    function(){
        website_body = document.getElementsByTagName("body")[0];

        // var loading_screen = document.getElementById("loading_screen");
        // loading_screen.style.display = "block";//show the loading screen until all the products are loaded

        //get the all products data from the simulated "backend"
        var get_all_products = () => {
            return new Promise((resolve, reject)=> {
                var products_request = new XMLHttpRequest();
                products_request.onreadystatechange = function(){
                    if(this.readyState === 4){//gotten feedback
                        if(this.status === 200){//received success feedback
                            var products_json = JSON.parse(this.responseText);

                            resolve(products_json);
                        }
                        else{
                            reject("Failed to load the products.");
                        }
                    }
                }
                products_request.open("GET", "./data/products.json", false);
                products_request.send();
            });
        }

        var append_all_products = async () => {
            const products_data = await get_all_products();

            //--------------------------------------------------------------------------------------
            //Get all products and show them.
            //The products are in the "products.js" file (just to simulate getting data from the backend)
            var products_list_view = document.getElementById("products_list");

            for(c = 0; c < products_data.length; c++){
                var product = document.createElement("div");
                product.id = products_data[c].product_id;
                product.classList.add("product");

                //add all the needed inner html elements before we fill in the product's parameters
                product.innerHTML = `<img class="product_img" src="${products_data[c].product_image}" alt="${products_data[c].product_name}" width="300px">
                <div class="product_overlay_dark_gradient"></div>
                <div class="product_info_container">
                    <p class="product_name">${products_data[c].product_name}</p>
                    <p class="product_price">$${products_data[c].product_price}</p>
                    <button id="${products_data[c].product_id}" class="product_purchase_btn link_button link_button_gradient">VIEW</button>
                </div>`;

                //product-view button functionality is being handled by the "Purchaser.js" script because access to the functions/variables/classes in the "Purchaser.js" script is restricted for security reasons

                products_list_view.appendChild(product);
            }
        }

        append_all_products();

    }
);

var show_notification = (text, good_notification) => {//either a good or bad notification
    var temp_notification = document.createElement('div');
    temp_notification.classList.add("cart_change_notifier", good_notification? "good_notification" : "bad_notification");
    temp_notification.innerHTML = `<p class="descriptive_text_light white_text center_text">${text}</p>`;

    website_body.appendChild(temp_notification);

    setTimeout(() => {
        temp_notification.remove();
    },2500);
}
