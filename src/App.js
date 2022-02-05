import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");
  const [searchData, setSearchData] = useState([]);

  const [ltp, setltp] = useState("");
  const [lcp, setlcp] = useState("");
  const [stockName, setStockName] = useState("");

  const debounceSearchTerm = useDebounce(searchTerm, 1000);

  const handleFormSubmit = () => {
    var bodyFormData = new FormData();
    // bodyFormData.append("name", stockName);
    // bodyFormData.append("lcp", lcp);
    // bodyFormData.append("ltp", ltp);
    console.log(
      "json data: ",
      JSON.stringify({
        name: stockName,
        ltp,
        lcp,
      })
    );
    console.log("bodyFormData: ", bodyFormData);
    axios({
      method: "post",
      url: `http://3.108.225.220:5000/api/data`,
      headers: {
        "user-access-token": token,
      },
      data: JSON.stringify({
        name: stockName,
        ltp,
        lcp,
      }),
    })
      .then((res) => {
        console.log("res: ", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const handleButtonClick = () => {
  //   console.log("button pressed");
  //   axios({
  //     method: "get",
  //     url: `http://3.108.225.220:5000/api/data?search_string=${searchTerm}`,
  //     headers: { "user-access-token": token },
  //   })
  //     .then((data) => {
  //       console.log(data.data);
  //       setSearchData(data.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  useEffect(() => {
    axios
      .get("http://3.108.225.220:5000/api/user-access-token")
      .then((data) => {
        setToken(data.data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (debounceSearchTerm) {
      axios({
        method: "get",
        url: `http://3.108.225.220:5000/api/data?search_string=${searchTerm}`,
        headers: { "user-access-token": token },
      })
        .then((data) => {
          setSearchData(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [debounceSearchTerm]);

  return (
    <>
      <div className="App">Tinkerr Search</div>;
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      {/* <button onClick={handleButtonClick}>Search</button> */}
      <div>
        <ul>
          {searchData.length > 0 &&
            searchData.map((data) => {
              return (
                <li>
                  <span>{data[0]}</span>
                  {data[1]}
                  {data[2]}
                </li>
              );
            })}
        </ul>
      </div>
      <div>
        <div>Form</div>

        <input
          type="text"
          placeholder="stock name"
          value={stockName}
          onChange={(e) => {
            setStockName(e.target.value);
          }}
        />
        <input
          type="text"
          value={ltp}
          placeholder="ltp"
          onChange={(e) => {
            setltp(e.target.value);
          }}
        />
        <input
          type="text"
          value={lcp}
          placeholder="lcp"
          onChange={(e) => {
            setlcp(e.target.value);
          }}
        />
        <button onClick={handleFormSubmit}>Submit</button>
      </div>
    </>
  );
}

export default App;
