function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 12,
    mapTypeId: "roadmap",
  });
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);


  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

	let infowindows = [];
  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }
      
      const marker = new google.maps.Marker({
            map: map,
            title: place.name,
            position: place.geometry.location,
          });

      // Create a marker for each place.
      markers.push(marker);
      
     const infowindow = new google.maps.InfoWindow();
     
          const service = new google.maps.places.PlacesService(map);
          service.getDetails(
            {
              placeId: place.place_id,
              fields: ["name", "formatted_address", "formatted_phone_number", "website"],
            },
            (placeDetails, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                infowindow.setContent(`
                  <div>
                    <h3>${placeDetails.name}</h3>
                    <p>Address: ${placeDetails.formatted_address}</p>
                    <p>Phone: ${placeDetails.formatted_phone_number}</p>
                  </div>
                `);
              } else {
                infowindow.setContent("<div>No details available.</div>");
              }
            }
          );
          
          infowindows.push(infowindow);

          marker.addListener("click", () => {
            infowindows.forEach((iw) => iw.close());
            infowindow.open(map, marker);
          
 });
           
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  
  
}

window.initAutocomplete = initAutocomplete;
