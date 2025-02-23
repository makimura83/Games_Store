function addToCart(gameId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.includes(gameId)) {
        cart.push(gameId);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("เพิ่มเกมลงตะกร้าแล้ว!");
    } else {
        alert("เกมนี้อยู่ในตะกร้าแล้ว!");
    }
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    fetch("http://localhost:5000/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ games: cart })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("ชำระเงินสำเร็จ! 🎉");
            localStorage.removeItem("cart");
            window.location.href = "profile.html";
        } else {
            alert("เกิดข้อผิดพลาด!");
        }
    })
    .catch(error => console.error("Checkout error:", error));
}
