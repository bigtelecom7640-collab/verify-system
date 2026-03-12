// guard.js
window.onerror = function() { return true; }; // กันไม่ให้ขึ้น Error หน้าขาว
window.onunload = function() {}; 

function checkNetworkStatus() {
    if (!navigator.onLine) {
        console.log("Connection lost, waiting...");
    }
}
setInterval(checkNetworkStatus, 3000);
