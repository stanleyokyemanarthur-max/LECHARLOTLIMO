// // src/hooks/useGoogleMaps.js
// import { useState, useEffect } from "react";

// export default function useGoogleMaps(apiKey) {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     if (window.google && window.google.maps) {
//       setLoaded(true);
//       return;
//     }

//     const existingScript = document.getElementById("google-maps");
//     if (existingScript) {
//       existingScript.addEventListener("load", () => setLoaded(true));
//       return;
//     }

//     const script = document.createElement("script");
//     script.id = "google-maps";
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
//     script.async = true;
//     script.defer = true;
//     script.onload = () => setLoaded(true);
//     document.body.appendChild(script);
//   }, [AIzaSyAsw0GEYm94GAZ1aQZDfSnrn_0pUNnnBEY]);

//   return loaded;
// }
