import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import WindowEventService from "news_app/PubSub";
import Reporting from "./components/Reporting";
import ReportingWithInfiniteScroll from "./components/Report";
import { BASE_URL } from "./utils/constants";
import Box from "@mui/material/Box";

import "./index.css";
import Typography from "@mui/material/Typography";

const App = () => {
  // TODO: REMOVE this code:
  // TEST: Firing an EVENT to which you subscribed
  // const obj = {
  //   id: 1234
  // }

  // WindowEventService.fire("clickedNews", obj);
  // setTimeout(() => {
  //   console.log("inside setimeout");
  //   WindowEventService.fire("clickedNews", obj);
  // }, 1);

  useEffect(() => {
    console.log("first", WindowEventService);

    WindowEventService.subscribe("clickedNews", async (event) => {
      console.log("successfully Subscribed!", event.detail);
      const { news_id } = event.detail;
      await increaseNewsReadCount(news_id);
    });
    async function increaseNewsReadCount(news_id) {
      try {
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: news_id }),
        };
        console.log(`requestOptions`, requestOptions);
        // const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';
        const apiUrl = "http://localhost:8181/updateClickCount";
        const response = await fetch(apiUrl, requestOptions);
        let data = await response.json();
      } catch (error) {
        console.log("OOPS!, error", error);
      }
    }

    return () => {
      WindowEventService.unsubscribe("clickedNews", () => {
        console.log("successfully unsubscribed!");
      });
    };
  }, []);

  return (
    // <div className="container">
    //   {/* <div>Name: reporting-mfe</div>
    //   <div>Framework: react</div>
    //   <div>Language: JavaScript</div>
    //   <div>CSS: Empty CSS</div> */}
    //   {/* <Reporting></Reporting> */}

    //   <h1>Reporting</h1>
    //   <ReportingWithInfiniteScroll></ReportingWithInfiniteScroll>
    // </div>

    <Box
      sx={{
        maxWidth: "75%",
        marginTop: "6rem",
        marginLeft: "4rem",
      }}
    >
      <Typography variant="h4">Reporting</Typography>
      <ReportingWithInfiniteScroll />
    </Box>
  );
};

export default App;

ReactDOM.render(<App />, document.getElementById("app"));
