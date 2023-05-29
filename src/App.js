import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import WindowEventService from "news_layout/PubSub";
import Reporting from "./components/Reporting";
import ReportingWithInfiniteScroll from "./components/Report";

import "./index.css";

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
    const requestOptions = {
      method: 'PUT',
      // headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ title: 'React PUT Request Example' })
    };

    WindowEventService.subscribe("clickedNews", async () => { console.log("successfully Subscribed!"); await increaseNewsReadCount(); });
    
    async function increaseNewsReadCount() {
      const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';
      const response = await fetch(apiUrl, requestOptions);
      let data = await response.json();
      console.log(data);
    }
    
    
    console.log("last");
    return () => {
      WindowEventService.unsubscribe("clickedNews", () => { console.log("successfully unsubscribed!") });
    }
  }, []);

  return (
    <div className="container">
      {/* <div>Name: reporting-mfe</div>
      <div>Framework: react</div>
      <div>Language: JavaScript</div>
      <div>CSS: Empty CSS</div> */}
      {/* <Reporting></Reporting> */}
      <ReportingWithInfiniteScroll></ReportingWithInfiniteScroll>
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById("app"));
