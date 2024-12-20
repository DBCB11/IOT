 "use client"; 
// import { GoogleMap, LoadScript, MarkerF ,useJsApiLoader } from '@react-google-maps/api';
import React from 'react';
import { useEffect, useState } from "react";
import ReactMapGL , {Marker ,Source, Layer} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Home() {
  
type loc = {
  id : number;
  longitude: number | undefined;
  latitude: number | undefined;
  time :string;
};

type state = {
  longitude: number | undefined;
  latitude: number | undefined;
  zoom :number | undefined;
};

const [Loc , setLoc]= useState<loc | null >({
  id : 32,
  longitude: 105.84318434418022,
  latitude: 21.006358476679914,
  time : "1245123"
});

const [His , setHis]= useState<loc[] | null>( [{
  id : 32,
  longitude: 105.84318434418022,
  latitude: 21.006358476679914,
  time : "1245123"
}]);

const [viewState, setviewState] = useState < state | null>({
  latitude: 21.006358476679914,
  longitude: 105.84318434418022,
  zoom: 16
} )

const [showHistory, setShowHistory] = useState(false);




const toggleMarker = () => {
  setShowHistory((prev) => !prev); // Toggle the marker visibility
};
const center = {
  lat: 21.006358476679914, 
  lng: 105.84318434418022,
}

const getLocation = async () => {
  try {
    const res= await fetch('http://203.171.20.94:9202/iot/latest',{
      method: "GET",
      next: {
        revalidate: 1,
      }
    });
    if( res ) {
      const Loc = await res.json(); 
      if(Loc) {setLoc(Loc);  
     
      console.log(Loc);
    }
    }
  } catch (error) {
    console.log(error)
  }
}

const getHistory= async () => {
  try {
    const res= await fetch('http://203.171.20.94:9202/iot/get-all',{
      method: "GET",
      next: {
        revalidate: 1,
      }
    });
    if( res ) {
      const data : loc[] = await res.json();
      if(data) {
        setHis(data);
      }
    }
  } catch (error) {
    console.log(error)
  }
}

useEffect(()=> {
  getLocation();
  const interval = setInterval(getLocation, 3000);
  return () => {
    clearInterval(interval);
  };
}, [])
useEffect(()=> {
  getHistory();
  const interval = setInterval(getHistory, 3000);
  return () => {
    clearInterval(interval);
  };
}, [])

useEffect(()=>{
    setviewState((prevState) => ({
      zoom: prevState?.zoom,  // Keep zoom intact
      latitude: Loc?.latitude, // New Latitude for Los Angeles
      longitude:Loc?.longitude, // New Longitude for Los Angeles
  }))
},[Loc]);



if(Loc && His){

const geojson = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: His.map((marker) => [marker.longitude, marker.latitude]),
  },
};

  return (
    <div>
        <ReactMapGL
            mapboxAccessToken = "pk.eyJ1IjoibWluaDEwMDkiLCJhIjoiY200NWRiMGdqMHZ4ZjJqb294MjV3bmdiMiJ9.lAsmEJWGKNrEdGPHs5Ze7Q"
            {...viewState}
            onMove={evt => setviewState(evt.viewState)}
          
            style={{width: '100%', height: '90vh'}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          {Loc.longitude !== undefined&& Loc.latitude !== undefined  && <Marker longitude = {Loc?.longitude} latitude = {Loc?.latitude} color = 'green'></Marker>} 
          {His &&
            His.slice(0, -1).map((item)=>(
              showHistory && item.longitude !== undefined&& item.latitude !== undefined  && <Marker  key={item?.id} longitude = {item?.longitude} latitude = {item?.latitude} >
                <img
                  src={'/target.png'}
                  alt="Custom Icon"
                  style={{ width: "30px", height: "30px" }}
                />
              </Marker>
            ))
          }
          {showHistory &&<Source id="line-source" type="geojson" data={geojson}>
            <Layer id="line" type="line" paint={{ "line-color": "#0000FF", "line-width": 4 }} />
          </Source>}
        </ReactMapGL>
        <button  style={{
                textAlign: 'center', // Corrected property
                backgroundColor: '#008CBA', // Corrected property
                padding: '15px 32px',
                }}
          onClick={toggleMarker}
        >
          History</button>
    </div>
  )
}
else{
  return (
  <ReactMapGL
        mapboxAccessToken = "pk.eyJ1IjoibWluaDEwMDkiLCJhIjoiY200NWRiMGdqMHZ4ZjJqb294MjV3bmdiMiJ9.lAsmEJWGKNrEdGPHs5Ze7Q"
        initialViewState={{
          latitude:  center.lat,
          longitude:  center.lng,
          zoom: 16
        }}
        style={{width: '100%', height: '90vh'}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
    >
       <Marker longitude={center.lng} latitude={center.lat} color = 'blue' >
      </Marker>
    </ReactMapGL>
   
    )

}
}
