 "use client"; 
// import { GoogleMap, LoadScript, MarkerF ,useJsApiLoader } from '@react-google-maps/api';
import React from 'react';
import { useEffect, useState } from "react";
import ReactMapGL , {Marker ,Source, Layer} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
const forge = require('node-forge')
const crypto = require("crypto-js")

const publicKey = `
-----BEGIN PUBLIC KEY-----
MIIBCgKCAQEAuqvwyKfMPcEkSElMM59pBNFLJLIAqJYWdHe6w7oaHf9sPNTQ3g+/E9dUuZH8TWqimPr5Wq/2pDmD8D4wnXeNe0
9ldsPFxGMrLxdHEscin56+SAVoX1O0bumSUIKiODHLTNkxAIibZkUbPSJZDySRLAoQ+21e9JL6/ocRMN21W37CF/HVPBB5JPLIO
go2zqg3VX9DUIKQG72Wh8b6TGMwDE4FIQQXcsTA1UuCVEC41B0FQnygA6IdK11TTart5WMFRhWufcI/yZL7MF+/4myob5m5ESa4o
QWHT7twHOjpfo7uJRF9PaB7lRMWQH5sEnQqBdjNUicFpTPR0D7XxKmLDQIDAQAB
-----END PUBLIC KEY-----
`;

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


const [selectedDate, setSelectedDate] = useState<string | null>(null);

function verifyWithNodeForge(data: string, signature: string, publicKeyPem: string): boolean {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    const md = forge.md.sha256.create();
    md.update(data, "utf8");
    const isValid = publicKey.verify(md.digest().bytes(), forge.util.decode64(signature));
    return isValid;
  } catch (error) {
    console.error("Error verifying signature with node-forge:", error);
    return false;
  }
}


const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSelectedDate(event.target.value);

  getHistory({datetime:event.target.value});
};

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

    // const dataTest = JSON.stringify({
    //   Id: 357,
    //   Longitude: 105.011,
    //   Latitude: 21.01,
    //   Time: '2024-12-22T10:19:40.373',
    // });


    // const signatureTest =
    //   'c6UkcEkCMnu/wD/+MFADXBrytItkVStNk9IbodxuA5UZLtEvsxN/dtBvQE2kulbk/StMthqbAVT8MNd+L6Ieq983WkPtnASwi63memgeIcTqfKUc9XJYXi88KjwqIlFZl9Tr6TWCFpWZaP5j8U8n6gwqMNlecQgD3XAdwAkG+SSruokGdF9jcbmEceIQiy99HBHOwuGBiKZVuBx9jbLsDY/E6GriRda0Vm+ezBG/YLY6fYiNatUeWWPLafXFAu2VWeixbDaB4eQkOXNXLUHfNaPUe4Zl4Yjhsl40DC8GUS/vryM5V0xs3oxGl9cuEehUIkIrVEQrBIEdyPhixJB9BQ==';

    if( res ) { 
      const Loc = await res.json();
      console.log(Loc)
      // const data: string = JSON.stringify(Loc.data); 
      // const signature: string = Loc.signature.toString(); // Base64-encoded signature
      // const result: boolean = verifyWithNodeForge(data, signature, publicKey);
      // console.log('Signature is valid:', result);
      // const isVerifiedTest = verifyData(dataTest, signatureTest, publicKey);

      // console.log('Signature Verified:', isVerifiedTest);
      if(Loc /*&& result*/ ) {setLoc(Loc.data);  
    }
    }
  } catch (error) {
    console.log(error)
  }
}

// function verifyData(data: string, signature: string, publicKey: string): boolean {
//   const verifier = crypto.createVerify('sha256');
//   verifier.update(data);
//   verifier.end();

//   return verifier.verify(publicKey, signature, 'base64');
// }


const getHistory= async (params: { datetime: string }) => {
  try {
    const url = `http://203.171.20.94:9202/iot/by-date?time=${params.datetime}`;
    const res= await fetch(url,{
      method: "GET",
      next: {
        revalidate: 1,
      }
    });
    if( res ) {
      const jse = await res.json();
      const data : loc[] = jse.data;
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
  // const interval = setInterval(getLocation, 3000);
  // return () => {
  //   clearInterval(interval);
  // };
}, [])
// useEffect(()=> {
//   getHistory();
//   const interval = setInterval(getHistory, 3000);
//   return () => {
//     clearInterval(interval);
//   };
// }, [])

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
           
          {His &&
            His.map((item)=>(
              showHistory && item.longitude !== undefined&& item.latitude !== undefined  && <Marker  key={item?.id} longitude = {item?.longitude} latitude = {item?.latitude} >
                <img
                  src={'/target.png'}
                  alt="Custom Icon"
                  style={{ width: "30px", height: "30px" }}
                />
              </Marker>
            ))
          }

{Loc.longitude !== undefined&& Loc.latitude !== undefined  && <Marker longitude = {Loc?.longitude} latitude = {Loc?.latitude} color = 'green'></Marker>}

          {showHistory &&<Source id="line-source" type="geojson" data={geojson}>
            <Layer id="line" type="line" paint={{ "line-color": "#0000FF", "line-width": 4 }} />
          </Source>}
        </ReactMapGL>
        
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
    
        >
          <input
            type="date"
            id="date-picker"
            name="date-picker"
            value={selectedDate || ''}
            onChange={handleDateChange }
            min="2024-01-01" 
            max="2024-12-31" 
            style={{
              textAlign: 'center', 
              backgroundColor: 'while', 
              padding: '15px 32px',
              color: 'black'
              }}
          />
          
            <button  style={{
                  textAlign: 'center', // Corrected property
                  backgroundColor: '#008CBA', // Corrected property
                  padding: '15px 32px',
                  }}
            onClick={toggleMarker}
            >
            History</button>
          
          </div>
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
