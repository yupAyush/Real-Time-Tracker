const socket = io();
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },

        (error) => {
            console.log(error);
        },

        {
            enableHighAccuracy: true,
            timeout: 1000,
            maximumAge: 0


        }

    )

}


const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);
const marker = {};

socket.on("recieve-location", function(location) {
    const { id, latitude, longitude } = location;
    map.setView([latitude, longitude], 10);
    if (marker[id]) {
        marker[id].setLatLng([latitude, longitude]);
    } else {
        marker[id] = L.marker([latitude, longitude]).addTo(map);
        1

    }


})

socket.on("disconnect", function(id) {
    if (marker[id]) {
        map.removeLayer(marker[id]);
        delete marker[id];
    }
})