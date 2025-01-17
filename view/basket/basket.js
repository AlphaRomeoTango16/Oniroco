var searchParam = (new URL(window.location)).searchParams;
var id = searchParam.get("id");

var basket = getBasket();
        for (let product of basket) {
            let furniture = new Furniture(product);
                document.querySelector("#basket_content").innerHTML += `<tr class="basket-line" data-id="${furniture._id}" data-customisation="${furniture.customisation}">
                                                                            <td scope="col">
                                                                                ${furniture.name}
                                                                                <a class="remove" role="button"><i class="bi bi-x"></i></a>
                                                                            </td>
                                                                            <td scope="col">
                                                                                ${furniture.customisation}
                                                                            </td>
                                                                            <td scope="col" class="price">
                                                                                ${furniture.getFormatedPrice()}
                                                                            </td>
                                                                            <td>
                                                                                <a role="button" class="dec"><i class="bi bi-dash-circle-fill"></i></a>
                                                                                <input class="counter" value="${furniture.quantity}" disabled>
                                                                                <a role="button" class="inc"><i class="bi bi-plus-circle-fill"></i></a>
                                                                            </td>
                                                                            <td scope="col" class="total-price">
                                                                                ${furniture.getTotalPrice().toFixed(2)} €
                                                                            </td>
                                                                        </tr>`;
                                                                        
        }
        document.querySelectorAll(".remove").forEach(btn => {
            btn.addEventListener("click", function (){
                let basketLine = this.closest(".basket-line");
                remove({
                    _id:basketLine.dataset.id,
                    customisation:basketLine.dataset.customisation
                });
                basketLine.remove();
                showTotal();
            })
        })
    
        document.querySelectorAll(".dec").forEach(btn => {
            btn.addEventListener("click", function (){
                let basketLine =this.closest(".basket-line");
                let product = decrease({
                    _id:basketLine.dataset.id,
                    customisation:basketLine.dataset.customisation
                });
                let furniture = new Furniture(product);
                basketLine.querySelector(".counter").value = furniture.quantity;
                basketLine.querySelector(".total-price").innerHTML = furniture.getTotalPrice().toFixed(2)+" €";
                showTotal();
            })
        })

        document.querySelectorAll(".inc").forEach(btn => {
                btn.addEventListener("click", function (){
                    let basketLine = this.closest(".basket-line");
                    let product = addBasket({
                        _id:basketLine.dataset.id,
                        customisation:basketLine.dataset.customisation
                    });
                    let furniture = new Furniture(product);
                    basketLine.querySelector(".counter").value = furniture.quantity;
                    basketLine.querySelector(".total-price").innerHTML = furniture.getTotalPrice().toFixed(2)+" €";
                    showTotal();
                })
        })
    
    function showTotal(){
        document.querySelector("#total-basket").innerHTML = getTotalAmount().toFixed(2)+" €";
    }
    showTotal();

    document.querySelector(".takeOrders").addEventListener("click", function() {
        var valid = true;
        for(let input of document.querySelectorAll(".form-control")){
            valid &= input.reportValidity();
            if(!valid){
                break;
            }
        }
        if(valid){
            alert("Votre commande a bien été passé.")
            let contact = {
                firstName : document.getElementById("first_name").value,
                lastName : document.getElementById("last_name").value,
                email : document.getElementById("email").value,
                address : document.getElementById("adress").value,
                city : document.getElementById("city").value
            }
            furnitureManager.postBasket(contact, getBasketId())
            .then(data => data.json())
            .then(order => {
                location.assign(`../order/order.html?orderId=${order.orderId}`);
            })
        }
    })