import React, { useState } from 'react';
import "./App.css";
import Axios from "axios";
import apiKey from './key';


function App() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState("");
  const [roster, setRoster] = useState(null);
  const [store, setStore] = useState(null);
  const [resultJson, setResultJson] = useState([]);
  const [currentlyLocation, setCurrentlyLocation] = useState("");
 // const [_id, set_id] = useState(null);
 const [latitude, setLatitude] = React.useState(53.3456365);
 const [longitude, setLongitude] = React.useState(-6.2624122);
 const [loginUserId, setLoginUserId] = React.useState("");

  const register = () => {
    Axios({
      method: "POST",
      data: {
        email: registerEmail,
        password: registerPassword,
      },
      withCredentials: true,
      url: "http://localhost:4000/register",
    }).then((res) => console.log(res));
  };
  const login = () => {
    Axios({
      method: "POST",
      data: {
        email: loginEmail,
        password: loginPassword,
      },
      withCredentials: true,
      url: "http://localhost:4000/login",
    }).then((res) => {
     //console.log('authenticated');
     let myData = [res.data];
     console.log(myData)
     setLoginUserId(myData);
    // console.log(loginUserId)
  }).catch(err=>console.error(err))
}

  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/user",
    }).then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  };
  const getRosterByUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `http://localhost:4000/roster/${loginUserId}`,
    }).then((res) => {
      setRoster(res.data);
      console.log(res.data);
    });
  };

  //---------------------------------------------------------
  const logout = () => {
    Axios({
      method: "GET",
      url: `http://localhost:4000/logout`,
    }).then((res) => {
      console.log(res.data);
    });
  };
  //--------------------------------------------------------
 
   window.onload = function()
{
   if (navigator.geolocation) { 
  
    // To add PositionOptions
	
  navigator.geolocation.getCurrentPosition(getPosition);
  
  } else { 
	alert("Oops! This browser does not support HTML Geolocation.");
  }
}
function getPosition(position)
{
  document.getElementById("location").innerHTML = 
	  "Latitude: " + position.coords.latitude + "<br>" +
    "Longitude: " + position.coords.longitude;
    
}

React.useEffect(() => {
      async function loadGoogle() {
        if (latitude && longitude) {
          const PROXY_URL = "https://cors-anywhere.herokuapp.com/";
          const TARGET_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&name=tesco&radius=0.1&type=grocery_or_supermarket&key=${apiKey}`;
          const URL = PROXY_URL + TARGET_URL;
          await fetch(URL)
            .then((response) => response.json())
            .then((json) => setResultJson(json.results))
            .catch((error) => alert(error));
        }
      }
      loadGoogle();
    }, [latitude, longitude]);

    // .then((json) => setResultJson(json.results))
    //.then((json) => setCurrentlyLocation(json.results[0].vicinity))

    const checkLocation = (place_id) =>{
    var stringPlaceId = (JSON.stringify(place_id));
    console.log(stringPlaceId);

    let newArray = resultJson.filter(function (item) {
      return item.reference === place_id;
    })    
    
    console.log(newArray)
    if (typeof newArray != "undefined"
              && newArray !== null 
              && newArray.length !== null 
              && newArray.length > 0){
              console.log(`You are in the site!<br/>`)
              document.getElementById("confirm_location").innerHTML = "You are in the site! ";
              //alert('Location confirmed !');
              }else{
                console.log('Store not found');
                document.getElementById("confirm_location").innerHTML = "You are more than 100 meters from the store, clock in not possible!";
                //alert('Location not confirmed !');
              }
            
        }    
      
   return (    

  <div className="App">


      <div>
        <h1>Register</h1>
        <input
          placeholder="email"
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
        <input type="password" 
          placeholder="password"
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <button onClick={register}>Submit</button>
   
      </div>
      
      <div>
        <h1>Login</h1>
        <input
          placeholder="email"
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input type="password" 
          placeholder="password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={login}>Submit</button>
      </div>
        <div>

        <button onClick={getRosterByUser}>roster</button>
                  
  <p id="location"></p>
  <p id="confirm_location"></p>
  <p>{currentlyLocation}</p>

  
          {roster && roster.map((item, key) => (
           <ul key={key} class="list-item">
            {/* <li><button class="button" onClick={()=>this.checkLocation(item.roster.place_id)}>{item.week.date}  {item.week.day}  {item.roster.storeName}  {item.week.time}</button></li> */}
             <li><button class="button" onClick={()=> checkLocation(item.roster.place_id)}>{item.week.date}  {item.week.day}  {item.roster.storeName}  {item.week.time}</button></li>
           </ul>
          ))}
            

          <div>
            <button onClick={logout} onClick={()=> window.location.reload()}>LOGOUT</button>

          </div>


        </div>
        </div>
  );
}
export default App;