import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import WindowEventService from "news_layout/PubSub";
import Reporting from "./components/Reporting";
import ReportingWithInfiniteScroll from "./components/Report";
import { BASE_URL } from './utils/constants';

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

    WindowEventService.subscribe("clickedNews", async () => {
      // console.log("successfully Subscribed!");
      await increaseNewsReadCount();
    });
    async function increaseNewsReadCount() {
      try {
        // const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';
        const apiUrl = `${BASE_URL}updateClickCount`;
        const response = await fetch(apiUrl, requestOptions);
        let data = await response.json();
      } catch (error) {
        console.log("OOPS!, error", error)
      }
    }

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
      <h1>Reporting Data</h1>
      <ReportingWithInfiniteScroll></ReportingWithInfiniteScroll>
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById("app"));
