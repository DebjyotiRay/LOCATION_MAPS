
var map;
var markers = [];
var infoWindow;
var locationSelect;



function initMap() {
           var losAngeles = {
        			lat: 34.063380, 
       				 lng: -118.358080
    };
          map = new google.maps.Map(document.getElementById('map'), {
            center: losAngeles,
            zoom: 11,
            mapTypeId: 'roadmap',
            
          });

          infoWindow = new google.maps.InfoWindow();
          searchStores();
        }

function setOnClickListener(){
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
      elem.addEventListener('click', function(){
          new google.maps.event.trigger(markers[index], 'click');
      })
    })

    }
  




function displayStores(stores)
{ var storesHtml = '';
  stores.forEach(function(store, index){
    var address= store.addressLines;
    var phone = store.phoneNumber;

     storesHtml+=`<div class="store-container">
                    <div class="store-container-background">
                        <div class="store-info-container">
                            <div class="store-address">
                                <span>${address[0]}</span>
                                <span>${address[1]}</span>
                            </div>

                            <div class="store-phone-number"><i class="fas fa-phone-square-alt"></i>  <b> ${"             "+phone}</b></div>
                        </div>
                        <div class="store-number-container">
                            <div class="store-number">${index+1}</div>
                        </div>
                    </div>
                </div>`
  });
  document.querySelector('.stores-list').innerHTML = storesHtml;
}

function showStoreMarkers(stores){
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function(store, index){
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);

        var name = store.name;
        var address = store.addressLines[0];
        var phone = store.phoneNumber;
        if(store.openStatusText){
          var open = store.openStatusText;
        }
        
        createMarker(latlng, name, address, phone, open,  index);
        bounds.extend(latlng);
    })
    map.fitBounds(bounds);

}



function searchStores(){
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode){
        stores.forEach(function(store, index){
            var postal = store.address.postalCode.substring(0, 5);
            if(postal == zipCode){
                foundStores.push(store);
            }
        })
    } else {
        foundStores = stores;
    }

  
    clearLocations();
    displayStores(foundStores);
    showStoreMarkers(foundStores);
    setOnClickListener(foundStores);
    
}

function clearLocations() {
         infoWindow.close();
         for (var i = 0; i < markers.length; i++) {
           markers[i].setMap(null);
         }
         markers.length = 0;

      }


function createMarker(latlng, name, address, phone, open, index){
    var html = "<b>" + name + "</b> <br/>" +open+"<br/><br/> "+ address + " <br/>" + phone;
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      phone_number : phone,
      label: `${index+1}`
      
    });
    google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
    });
    markers.push(marker);
}