"use client"; 
// import { GoogleMap, LoadScript, MarkerF ,useJsApiLoader } from '@react-google-maps/api';
import React from 'react';
import { useEffect, useState } from "react";
import ReactMapGL , {Marker} from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

export default function Home() {
  
type loc = {
  id?: Number;
  longitude?: number;
  latitude?: number;
  time?:Date;
};

const [loc , setLoc]= useState<loc | null >(null);

const getLocation = async () => {
  try {
    const res= await fetch('http://203.171.20.94:9202/iot/latest',{
      method: "GET",
      next: {
        revalidate: 5,
      }
    });
    if( res ) {
      const loc = await res.json(); 
      if(loc) setLoc(loc);  
   
    }
   
    
  } catch (error) {
    console.log(error)
  }
}

useEffect(()=> {
  getLocation()
}, [])

const center = {
  lat: 21.006358476679914, 
  lng: 105.84318434418022,
}

const [viewState, setViewState] = React.useState({
  longitude: 105.84318434418022,
  latitude: 21.006358476679914,
  zoom: 3.5
});




const Picon = {
  url :"target.png",
  scaledSize:{ width: 20, height: 20}
}
const Licon = {
  url :"point.png",
  scaledSize:{ width: 50, height: 50}
}

// const { isLoaded } = useJsApiLoader({
//   googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
// })



if(loc)console.log(loc.latitude);


return (
    <ReactMapGL
        mapboxAccessToken = "pk.eyJ1IjoibWluaDEwMDkiLCJhIjoiY200NWRiMGdqMHZ4ZjJqb294MjV3bmdiMiJ9.lAsmEJWGKNrEdGPHs5Ze7Q"
        // mapboxAccessToken = {process.env.MAPBOX_TOKEN}
        initialViewState={{
          latitude: center.lat,
          longitude: center.lng,
          zoom: 17
        }}
        style={{width: '100%', height: '90vh'}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {loc && <Marker longitude={loc.latitude} latitude={loc.longitude} color = 'red' >
        {/* <img src= {Picon.url}/> */}
      </Marker>} 

      {!loc && <Marker longitude={center.lng} latitude={center.lat} color = 'red' >
        {/* <img src= {Picon.url}/> */}
      </Marker>}
    </ReactMapGL>
    // <main>
    //   {loc && <h1>{loc.longitude} </h1>}
    //   {loc && <h1>{loc.latitude} </h1>}
    //   {!loc && <h1> asfasf </h1>}
    // </main>
    )

}