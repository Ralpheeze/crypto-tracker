// //USESTATE MANAGEMENT
import React, { useEffect, useRef, useState } from 'react'

const Tracker = () => {

    const [prices, setPrices] = useState({}); 
    const [loading, setLoading] = useState(false); //loading indicates where a manual refresh is in progress
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(true); //contorls live updates

    const socketRef = useRef(null); //this is going to be the reference to the websocket instance

    const cryptos = [
        "bitcoin",
        "ethereum",
        "dogecoin",
        "cardano",
        // "ripple",
        "litecoin",
        // "polkadot",
        // "chainlink",
        // "stellar",
        // "uniswap",
    ];

    // {bitcoin, ethereum, dogecoin, ...}
    // console.log("socketRef", socketRef.current);

useEffect(() => {
    if (!isUpdating) return; 
    socketRef.current = new WebSocket(`wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`);
    //socketRef{{current: WebSocket()}
        //      {current: WebSocket(.........................))}
        //        }
    socketRef.current.onopen = () => {
        console.log("Connected to the socket");
        setError(null); //clear any previous errors during the connection

    }

    socketRef.current.onmessage = (event) => {
        const newPrices = JSON.parse(event.data);
        console.log("Messages", event.data);

        setPrices((prevPrices) => ({
            ...prevPrices,
            ...newPrices,
        }));
        //Spread operator

        // setPrices((prevPrices) => Object.assign({}, prevPrices, newPrices));
    };

    socketRef.current.onerror = (error) => {
        console.log("Websocket Error", error);
        setError("Websocket connection failed. Please try again");
    };

    socketRef.current.onclose = () => {
        console.log("Disconnected from the socket");
    };

        //cleanup function to close Websocket connection when the component unmounts
    return () => socketRef.current?.close(); 

}, [isUpdating]); //only runs when isUpdating changes

//Manual Refresh of the prices and resumes live updates
const fetchPrices = () => {
    setError(null);
    // const newSocket = new WebSocket(`wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`);
    setLoading(true);
    
    const newSocket = new WebSocket(`wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`);

    newSocket.onmessage = (event) => {
        const newPrices = JSON.parse(event.data);
        console.log("Received prices from Manual Refresh: ", newPrices);

        setPrices((prevPrices) => ({
            ...prevPrices,
            ...newPrices,
        }));

        setLoading(false);
        newSocket.close();

        if(!isUpdating) {
            console.log("Resuming live updates...");
            setIsUpdating(true);
        }
    };
    

    // newSocket.onerror = (error) => {
    //     console.error("Web socket error after Manual Refresh", error);
    //     setError("The connection failed. Please try again")
    //     setLoading(false);
    //     newSocket.close();
    // }

    // newSocket.onclose = () => {
    //     console.log("Disconnected from the socket afterManual Refresh");
    // }
    
    

    // if (!isUpdating) {
    //     return;
    // }

    // if (newSocket) {
    //     stopUpdates();
    // }
}

//STOP UPDATES FUNCTION
const stopUpdates = ()=> {
    setIsUpdating(false);

    if (socketRef.current) {
        socketRef.current.close(); //close websocket
        socketRef.current = null; //ensure it doesn't reconnect
    }
    // newSocket.onerror = (error) => {
    //     console.error("Web socket error after Manual Refresh", error);
    //     setError("The connection failed. Please try again")
    //     setLoading(false);
    //     newSocket.close();
    // }

    // newSocket.onclose = () => {
    //     console.log("Disconnected from the socket afterManual Refresh");
    // }
    // if(!isUpdating ) return;
    // console.log("Live updates stopped");

};

    return (

    <div className="tracker-container">
        <h2 className="tracker-title">Crypto Price Tracker</h2>

        {error && <p className="tracker-error">{error}</p>}

        {loading && <p className="tracker-loading">Fetching latest prices...</p>}

        <div className="crypto-grid">
            {cryptos.map((crypto) => (
            <div key={crypto} className="crypto-card">
                <h3>{crypto.charAt(0).toUpperCase() + crypto.slice(1)}</h3>
                <p className="crypto-price">${prices[crypto] || "Fetching..."}</p>
            </div>
            ))}
        </div>

      <button onClick={fetchPrices} className="tracker-button" disabled={loading}>
        🔄 Refresh Prices
      </button>

      <button onClick={stopUpdates} className="tracker-button stop-button">
        🛑 Stop Updates
      </button>
    </div>
  );
};

export default Tracker



//CORRECT ONE USING REDUX STATE MANAGEMENT
// import { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {  setPrices,  setLoading,  setError,  setIsUpdating} from "./store/trackerSlice";
// import "./tracker.css"; // Import the CSS file

// const Tracker = () => {
//   const dispatch = useDispatch();
//   const { prices, loading, error, isUpdating } = useSelector(
//     (state) => state.tracker
//   );

//   const socketRef = useRef(null);
//   const cryptos = ["bitcoin", "ethereum", "dogecoin", "cardano", "litecoin"];

//   useEffect(() => {
//     // setError(null);
//     if (!isUpdating) return;

//     // setError(null); // ✅ Clear previous errors before attempting connection

//     socketRef.current = new WebSocket(
//       `wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`
//     );

//     socketRef.current.onopen = () => {
//         console.log("WebSocket Connected.");
//         setError(null); // Clear previous error
//       };

//     socketRef.current.onmessage = (event) => {
//     setError(null); //CLear
//       const newPrices = JSON.parse(event.data);
//       console.log("Received Prices:", newPrices);
//       dispatch(setPrices(newPrices));
//     };

//     socketRef.current.onerror = (error) => {
//       console.error("WebSocket Error:", error);
//       setError("WebSocket connection failed. Please try again.");
//     //   console.log("Error State Updated:", error);
//     };

//     // socketRef.current.onerror = (error) => {
//     //     console.error("WebSocket Error:", error);
//     //     setError("WebSocket connection failed. Please try again.");
//     //     console.log("Error State Updated:", error); // ✅ Debug log
//     //   };

//     socketRef.current.onclose = () => {
//       console.log("WebSocket Closed.");
//     };

//     return () => socketRef.current?.close();
//   }, [isUpdating, dispatch]);

//   const fetchPrices = () => {
//     dispatch(setLoading(true));
//     dispatch(setError(null));

//     const tempSocket = new WebSocket(
//       `wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`
//     );

//     tempSocket.onmessage = (event) => {
//         setError(null);
//       const newPrices = JSON.parse(event.data);
//       console.log("Received Prices (Manual Refresh):", newPrices);
//       dispatch(setPrices(newPrices));
//       dispatch(setLoading(false));
//       tempSocket.close();

//       if (!isUpdating) {
//         console.log("Resuming live updates...");
//         dispatch(setIsUpdating(true));
//       }
//     };

//     tempSocket.onerror = (error) => {
//       console.error("WebSocket Error (Manual Refresh):", error);
//       dispatch(setError("WebSocket connection failed. Please try again."));
//       dispatch(setLoading(false));
//       tempSocket.close();
//     };

//     tempSocket.onclose = () => {
//       console.log("Manual Refresh WebSocket Closed.");
//     };
//   };

//   const stopUpdates = () => {
//     dispatch(setIsUpdating(false));
//     if (socketRef.current) {
//       socketRef.current.close();
//       socketRef.current = null;
//     }
//     console.log("Live updates stopped.");
//   };

//   return (
//     <div className="tracker-container">
//         {error && !prices && isUpdating && <p className="tracker-error">{error}</p>}

//       <h2 className="tracker-title">Crypto Price Tracker</h2>

//       {error && <p className="tracker-error">{error}</p>}
//       {loading && <p className="tracker-loading">Fetching latest prices...</p>}

//       <div className="crypto-grid">
//         {cryptos.map((crypto) => (
//           <div key={crypto} className="crypto-card">
//             <h3>{crypto.charAt(0).toUpperCase() + crypto.slice(1)}</h3>
//             <p className="crypto-price">${prices[crypto] || "Fetching..."}</p>
//           </div>
//         ))}
//       </div>

//       <button onClick={fetchPrices} className="tracker-button" disabled={loading}>
//         🔄 Refresh Prices
//       </button>

//       <button onClick={stopUpdates} className="tracker-button stop-button">
//         🛑 Stop Updates
//       </button>
//     </div>
//   );
// };

// export default Tracker;




//CORRECT ONE USING USESTATE

// import { useState, useEffect, useRef } from "react";
// import "./Tracker.css"; // Import the CSS file

// const Tracker = () => {
//   const [prices, setPrices] = useState({});
//   const [loading, setLoading] = useState(false); //loading indicates where a manual refresh is in progress. 
//   const [error, setError] = useState(null);
//   const [isUpdating, setIsUpdating] = useState(true); // Controls live updates


//   const socketRef = useRef(null); // Reference to WebSocket instance

//   const cryptos = [
//     "bitcoin",
//     "ethereum",
//     "dogecoin",
//     "cardano",
//     // "ripple",
//     "litecoin",
//     // "polkadot",
//     // "chainlink",
//     // "stellar",
//     // "uniswap",
//   ];

//   useEffect(() => {
//     // console.log("ref", socketRef);
//     if (!isUpdating) return; // Stop execution if updates are disabled
//     //it stops the effect from running when isUpdating is false because 
//     // it returns nothing, preventing a newWebSocket from being opened.
//     //To properly 

    
//     socketRef.current = new WebSocket(`wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`);
    
//     socketRef.current.onopen = () => {
//         console.log("WebSocket Connected.");
//         setError(null); // Clear previous error
//         };

//     socketRef.current.onmessage = (event) => {
//       const newPrices = JSON.parse(event.data);
//       console.log("Received Prices:", newPrices);

//       setPrices((prevPrices) => ({
//         ...prevPrices,
//         ...newPrices,
//       }));
//     // setPrices((prevPrices) => Object.assign({}, prevPrices, newPrices));
//     };

//     socketRef.current.onerror = (error) => {
//       console.error("WebSocket Error:", error);
//       setError("WebSocket connection failed. Please try again.");
//     };

//     socketRef.current.onclose = () => {
//       console.log("WebSocket Closed.");
//     };

//     // Cleanup function to close WebSocket when component unmounts or updates stop
//     return () => socketRef.current?.close();
//     //this closes the websocket connection and the old connection is removed
//   }, [isUpdating]); // Only runs when `isUpdating` changes from true to false

//   //Manual Refresh Function (Also Resumes Live Updates)
//   const fetchPrices = () => {
//     setLoading(true);
//     setError(null);

//     const tempSocket = new WebSocket(`wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`);
//     //.join(",") converts the cryptos array into a comma-separated string

//     tempSocket.onmessage = (event) => {
//       const newPrices = JSON.parse(event.data);
//       console.log("Received Prices (Manual Refresh):", newPrices);

//       setPrices((prevPrices) => ({
//         ...prevPrices,
//         ...newPrices,
//       }));

//       setLoading(false);
//       tempSocket.close();

//       // 🔥 Resume live updates if they were stopped
//       if (!isUpdating) {
//         console.log("Resuming live updates...");
//         setIsUpdating(true);
//       }
//     };

//     tempSocket.onerror = (error) => {
//       console.error("WebSocket Error (Manual Refresh):", error);
//       setError("WebSocket connection failed. Please try again.");
//       setLoading(false);
//       tempSocket.close();
//     };

//     tempSocket.onclose = () => {
//       console.log("Manual Refresh ...TheWebSocket Closed.");
//     };
//   };

//   // Stop updates and keep the last received prices
//   const stopUpdates = () => {
//     setIsUpdating(false);
//     if (socketRef.current) {
//       socketRef.current.close(); // Close WebSocket
//       socketRef.current = null; // Ensure it doesn't reconnect
//     }
//     console.log("Live updates stopped.");
//   };

//   return (
//     <div className="tracker-container">
//       <h2 className="tracker-title">Crypto Price Tracker</h2>

//       {error && <p className="tracker-error">{error}</p>}

//       {/* {loading && <p className="tracker-loading">Fetching latest prices...</p>} */}
//       {loading ? <p className="tracker-loading">Fetching latest prices...</p> : <p>Prices loaded</p>}


//       <div className="crypto-grid">
//         {cryptos.map((crypto) => (
//           <div key={crypto} className="crypto-card">
//             <h3>{crypto.charAt(0).toUpperCase() + crypto.slice(1)}</h3>
//             <p className="crypto-price">${prices[crypto] || "Fetching..."}</p>
//           </div>
//         ))}
//       </div>

//       <button onClick={fetchPrices} className="tracker-button" disabled={loading}>
//         🔄 Refresh Prices
//       </button>

//       <button onClick={stopUpdates} className="tracker-button stop-button">
//         🛑 Stop Updates
//       </button>
//     </div>
//   );
// };

// export default Tracker;






//MANUAL REFRESH BUTTON ADDED BUT ON WEB LOAD, THE PRICES AUTOMATICALLY UPDATE WITHOUT THE BUTTON

// import { useState, useEffect } from "react";
// import "./Tracker.css"; // Import the CSS file

// const Tracker = () => {
//   const [prices, setPrices] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const cryptos = [
//     "bitcoin",
//     "ethereum",
//     "dogecoin",
//     // "cardano",
//     // "ripple",
//     // "litecoin",
//     // "polkadot",
//     // "chainlink",
//     // "stellar",
//     // "uniswap",
//   ];

//   useEffect(() => {
//     const socket = new WebSocket(`wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`);

//     socket.onmessage = (event) => {
//       const newPrices = JSON.parse(event.data);
//       console.log("Received Prices:", newPrices);

//       // Update state immediately with the new prices
//       setPrices((prevPrices) => ({
//         ...prevPrices,
//         ...newPrices,
//       }));
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket Error:", error);
//       setError("WebSocket connection failed. Please try again.");
//     };

//     socket.onclose = () => {
//       console.log("WebSocket Closed.");
//     };

//     // Cleanup WebSocket when component unmounts
//     return () => socket.close();
//   }, []);

//   // Manual Refresh Function
//   const fetchPrices = () => {
//     setLoading(true);
//     setError(null);

//     const socket = new WebSocket(`wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`);

//     let updatedPrices = {};

//     socket.onmessage = (event) => {
//       const newPrices = JSON.parse(event.data);
//       console.log("Received Prices (Manual Refresh):", newPrices);

//       updatedPrices = { ...updatedPrices, ...newPrices };

//       // If all cryptos received, update state & close socket
//       if (cryptos.every((coin) => updatedPrices[coin])) {
//         setPrices(updatedPrices);
//         setLoading(false);
//         socket.close();
//       }
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket Error (Manual Refresh):", error);
//       setError("WebSocket connection failed. Please try again.");
//       setLoading(false);
//       socket.close();
//     };

//     socket.onclose = () => {
//       console.log("Manual Refresh WebSocket Closed.");
//     };
//   };

//   return (
//     <div className="tracker-container">
//       <h2 className="tracker-title">Crypto Price Tracker</h2>

//       {error && <p className="tracker-error">{error}</p>}

//       {loading && <p className="tracker-loading">Fetching latest prices...</p>}

//       <div className="crypto-grid">
//         {cryptos.map((crypto) => (
//           <div key={crypto} className="crypto-card">
//             <h3>{crypto.charAt(0).toUpperCase() + crypto.slice(1)}</h3>
//             <p className="crypto-price">${prices[crypto] || "Fetching..."}</p>
//           </div>
//         ))}
//       </div>

//       <button onClick={fetchPrices} className="tracker-button" disabled={loading}>
//         🔄 Refresh Prices
//       </button>
//     </div>
//   );
// };

// export default Tracker;





// import { useState, useEffect } from "react";
// import "./Tracker.css"; // Import the CSS file

// const Tracker = () => {
//   const [prices, setPrices] = useState({});
//   const [error, setError] = useState(null);

//   const cryptos = [
//     "bitcoin",
//     "ethereum",
//     "dogecoin",
//     // "cardano",
//     // "ripple",
//     // "litecoin",
//     // "polkadot",
//     // "chainlink",
//     // "stellar",
//     // "uniswap",
//   ];

//   useEffect(() => {
//     const socket = new WebSocket(`wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`);

//     socket.onmessage = (event) => {
//       const newPrices = JSON.parse(event.data);
//       console.log("Received Prices:", newPrices);

//       // Update state immediately with the new prices
//       setPrices((prevPrices) => ({
//         ...prevPrices,
//         ...newPrices,
//       }));
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket Error:", error);
//       setError("WebSocket connection failed. Please try again.");
//     };

//     socket.onclose = () => {
//       console.log("WebSocket Closed.");
//     };

//     // Cleanup WebSocket when component unmounts
//     return () => socket.close();
//   }, []);

//   return (
//     <div className="tracker-container">
//       <h2 className="tracker-title">Crypto Price Tracker</h2>

//       {error && <p className="tracker-error">{error}</p>}

//       <div className="crypto-grid">
//         {cryptos.map((crypto) => (
//           <div key={crypto} className="crypto-card">
//             <h3>{crypto.charAt(0).toUpperCase() + crypto.slice(1)}</h3>
//             <p className="crypto-price">${prices[crypto] || "Fetching..."}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Tracker;






//WORKS WELL

// import { useState } from "react";
// import "./Tracker.css"; // Import the CSS file

// const Tracker = () => {
//   const [prices, setPrices] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const cryptos = [
//     "bitcoin",
//     "ethereum",
//     "dogecoin",
//     "cardano",
//     "ripple",
//     "litecoin",
//     // "polkadot",
//     // "chainlink",
//     // "stellar",
//     // "uniswap",
//   ];

//   // Function to fetch new prices manually
//   const fetchPrices = () => {
//     setLoading(true);
//     setError(null);

//     const socket = new WebSocket(`wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`);

//     let updatedPrices = {};

//     socket.onmessage = (event) => {
//       const newPrices = JSON.parse(event.data);
//       console.log("Received Prices:", newPrices);

//       updatedPrices = { ...updatedPrices, ...newPrices };

//       // If all cryptos received, update state & close socket
//       if (cryptos.every((coin) => updatedPrices[coin])) {
//         setPrices(updatedPrices);
//         setLoading(false);
//         socket.close();
         
//       }
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket Error:", error);
//       setError("WebSocket connection failed. Please try again.");
//       setLoading(false);
//       socket.close();
//     };

//     socket.onclose = () => {
//       console.log("WebSocket Closed.");
//     };
//   };

//   return (
//     <div className="tracker-container">
//       <h2 className="tracker-title">Crypto Price Tracker</h2>

//       {error && <p className="tracker-error">{error}</p>}

//       {loading && <p className="tracker-loading">Fetching latest prices...</p>}

//       <div className="crypto-grid">
//         {cryptos.map((crypto) => (
//           <div key={crypto} className="crypto-card">
//             <h3>{crypto.charAt(0).toUpperCase() + crypto.slice(1)}</h3>
//             <p className="crypto-price">${prices[crypto] || "N/A"}</p>
//           </div>
//         ))}
//       </div>

//       <button onClick={fetchPrices} className="tracker-button" disabled={loading}>
//         🔄 Refresh Prices
//       </button>
//     </div>
//   );
// };

// export default Tracker;





//DISPLAYS THE PRICES ALL AT THE SAME TIME ONCE ALL ARE FETCHED WITH AN EXCELLENT UI: CORRECT ONE

// import { useState } from "react";
// import "./tracker.css";

// const Tracker = () => {
//   const [prices, setPrices] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Function to fetch new prices manually
//   const fetchPrices = () => {
//     setLoading(true);
//     setError(null); // Reset any previous errors

//     const socket = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin");

//     let updatedPrices = {}; // Temporary object to collect all prices

//     socket.onmessage = (event) => {
//       const newPrices = JSON.parse(event.data);
//       console.log("Received Prices:", newPrices);

//       // Merge new prices into temporary object
//       updatedPrices = { ...updatedPrices, ...newPrices };

//       // If all 3 cryptos received, update state & close socket
//       if (updatedPrices.bitcoin && updatedPrices.ethereum && updatedPrices.dogecoin) {
//         setPrices(updatedPrices);
//         setLoading(false);
//         socket.close(); // Close WebSocket
//       }
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket Error:", error);
//       setError("WebSocket connection failed. Please try again.");
//       setLoading(false);
//       socket.close();
//     };

//     socket.onclose = () => {
//       console.log("WebSocket Closed.");
//     };
//   };

//   return (
//     <div className="tracker-container">
//       <h2 className="tracker-title">Crypto Price Tracker</h2>
      
//       {error && <p className="tracker-error">{error}</p>}

//       {loading && <p className="tracker-loading">Fetching latest prices...</p>}

//       <div className="crypto-grid">
//         <div className="crypto-card">
//           <h3>Bitcoin (BTC)</h3>
//           <p className="crypto-price">${prices.bitcoin || "N/A"}</p>
//         </div>

//         <div className="crypto-card">
//           <h3>Ethereum (ETH)</h3>
//           <p className="crypto-price">${prices.ethereum || "N/A"}</p>
//         </div>

//         <div className="crypto-card">
//           <h3>Dogecoin (DOGE)</h3>
//           <p className="crypto-price">${prices.dogecoin || "N/A"}</p>
//         </div>
//       </div>

//       <button onClick={fetchPrices} className="tracker-button" disabled={loading}>
//         🔄 Refresh Prices
//       </button>
//     </div>
    
    
//     // <div style={{ textAlign: "center", padding: "20px" }}>
//     //   <h2>Crypto Price Tracker</h2>
//     //   {error && <p style={{ color: "red" }}>{error}</p>}
      
//     //   {loading ? (
//     //     <p>Fetching latest prices...</p>
//     //   ) : (
//     //     <div>
//     //       <p>Bitcoin (BTC): ${prices.bitcoin || "N/A"}</p>
//     //       <p>Ethereum (ETH): ${prices.ethereum || "N/A"}</p>
//     //       <p>Dogecoin (DOGE): ${prices.dogecoin || "N/A"}</p>
//     //     </div>
//     //   )}

//     //   <button 
//     //     onClick={fetchPrices} 
//     //     style={{ marginTop: "10px", padding: "10px", cursor: "pointer" }}
//     //     disabled={loading} // Disable button while fetching
//     //   >
//     //     🔄 Refresh Prices
//     //   </button>
//     // </div>
//   );
// };

// export default Tracker;




// import { useState } from "react";

// const Tracker = () => {
//   const [prices, setPrices] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Function to fetch new prices manually
//   const fetchPrices = () => {
//     setLoading(true);
//     setError(null); // Reset any previous errors

//     const socket = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin");

//     socket.onmessage = (event) => {
//       const newPrices = JSON.parse(event.data);
//       console.log("New Prices:", newPrices);
//       setPrices((prevPrices) => ({ ...prevPrices, ...newPrices }));
//       setLoading(false);
//       socket.close(); // Close WebSocket immediately after receiving data
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket Error:", error);
//       setError("WebSocket connection failed. Please try again.");
//       setLoading(false);
//       socket.close();
//     };

//     socket.onclose = () => {
//       console.log("WebSocket Closed.");
//     };
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h2>Crypto Price Tracker</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
      
//       {loading ? (
//         <p>Fetching latest prices...</p>
//       ) : (
//         <div>
//           <p>Bitcoin (BTC): ${prices.bitcoin || "N/A"}</p>
//           <p>Ethereum (ETH): ${prices.ethereum || "N/A"}</p>
//           <p>Dogecoin (DOGE): ${prices.dogecoin || "N/A"}</p>
//         </div>
//       )}

//       <button 
//         onClick={fetchPrices} 
//         style={{ marginTop: "10px", padding: "10px", cursor: "pointer" }}
//         disabled={loading} // Disable button while fetching
//       >
//         🔄 Refresh Prices
//       </button>
//     </div>
//   );
// };

// export default Tracker;



//USING WEBSOCKET API AND PRICES UPDATE ON ITS OWN

// import { useEffect, useState } from "react";

// const Tracker = () => {
//   const [prices, setPrices] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [socket, setSocket] = useState(null);

//   // Function to establish WebSocket connection
//   const connectWebSocket = () => {
//     setLoading(true);
//     setError(null); // Reset errors

//     const newSocket = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin");

//     newSocket.onmessage = (event) => {
//       const newPrices = JSON.parse(event.data);
//       console.log("New Prices:", newPrices);
//       setPrices((prevPrices) => ({ ...prevPrices, ...newPrices }));
//       setLoading(false);
//     };

//     newSocket.onerror = (error) => {
//       console.error("WebSocket Error:", error);
//       setError("WebSocket connection failed. Please try again.");
//       setLoading(false);
//     };

//     newSocket.onclose = () => {
//       console.warn("WebSocket Disconnected.");
//     };

//     setSocket(newSocket);
//   };

//   // useEffect to initialize WebSocket on component mount
//   useEffect(() => {
//     connectWebSocket();
//     return () => socket?.close(); // Cleanup on unmount
//   }, []);

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h2>Live Crypto Prices</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div>
//           <p>Bitcoin (BTC): ${prices.bitcoin || "N/A"}</p>
//           <p>Ethereum (ETH): ${prices.ethereum || "N/A"}</p>
//           <p>Dogecoin (DOGE): ${prices.dogecoin || "N/A"}</p>
//         </div>
//       )}
//       <button onClick={connectWebSocket} style={{ marginTop: "10px", padding: "10px", cursor: "pointer" }}>
//         Refresh Prices 🔄
//       </button>
//     </div>
//   );
// };

// export default Tracker;



