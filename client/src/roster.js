import React, { useState } from "react";
import Axios from "axios";

function roster(){

    const getRosterByUser = () => {
        Axios({
          method: "GET",
          withCredentials: true,
          url: "http://localhost:4000/roster",
        }).then((res) => {
          setData(res.data);
          console.log(res.data);
        });
      };
     

}

export default roster;