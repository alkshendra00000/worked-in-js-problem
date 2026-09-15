// Page load hone ke baad hi chale
document.addEventListener("DOMContentLoaded", function(){

    // Section switch
    window.showSection = function(id){
        document.getElementById("dashboard").style.display = "none";
        document.getElementById("products").style.display = "none";
        document.getElementById(id).style.display = "block";
    };

    
    const container = document.getElementById("productContainer");

    // DEBUG check
    console.log(container);

    if(container){
        products.forEach(p=>{
            const div = document.createElement("div");
            div.className = "product-card";

            div.innerHTML = `
                <img src="${p.image}" 
                     onerror="this.src='https://via.placeholder.com/200'">
                <h4>${p.name}</h4>
                <p>${p.price}</p>
                <button>Add to Cart</button>
            `;

            container.appendChild(div);
        });
    }else{
        console.log("❌ productContainer nahi mila");
    }

});