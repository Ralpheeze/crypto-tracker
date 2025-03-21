// import { useState } from "react";

// const Counter = () => {
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       <p>Count: {count}</p>
//       <button onClick={() => setCount(count + 1)}>Increment</button>
//     </div>
//   );
// }

// export default Counter;

import {useState, useEffect } from "react";

const FetchData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd") //request
      .then((response) => response.json()) //Response
      .then((json) => setData(json.bitcoin.usd));
  }, []);

  return <p>Bitcoin Price: ${data}</p>;
}

export default FetchData;


