window.addEventListener("load", () => {
  if (typeof L === "undefined") {
    return;
  }

  const mapElement = document.getElementById("map");
  if (!mapElement) {
    return;
  }

  const map = L.map("map", {
    scrollWheelZoom: false
  }).setView([-26.1367, 28.2411], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const locations = [
    {
      coords: [-26.2041, 28.0473],
      title: "Johannesburg support hub",
      description: "Emergency plumbing response and central dispatch support."
    },
    {
      coords: [-25.7479, 28.2293],
      title: "Pretoria service area",
      description: "Installations, maintenance, and scheduled inspections."
    },
    {
      coords: [-25.9992, 28.1263],
      title: "Midrand coverage",
      description: "Fast access to residential and commercial clients."
    }
  ];

  const bounds = [];

  locations.forEach((location) => {
    const marker = L.marker(location.coords).addTo(map);
    marker.bindPopup(
      `<strong>${location.title}</strong><br>${location.description}<br><a href="enquiry.html">Request availability</a>`
    );
    bounds.push(location.coords);
  });

  if (bounds.length > 1) {
    map.fitBounds(bounds, { padding: [24, 24] });
  }

  mapElement.addEventListener("focusin", () => {
    map.scrollWheelZoom.enable();
  });

  mapElement.addEventListener("focusout", () => {
    map.scrollWheelZoom.disable();
  });
});
