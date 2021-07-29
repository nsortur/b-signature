import React from "react"
import './App.css';
import MyNav from "./components/navbar/navbar"
import FormPage from './pages/form/form'
import ContentPage from './pages/content/content'
import LandingPage from './pages/landing/landing'
import SigningDone from './pages/signingCompleted/signingCompleted'
import { Router } from "@reach/router"

const NotFound = () => (
  <div className='App-header'>
    <h2>Page not found.</h2>
  </div>
);

function App() {

  return (
    <div className="App">
      <MyNav></MyNav>
      <Router>
        <LandingPage path='/'></LandingPage>
        <FormPage path='/form'></FormPage>
        <ContentPage path='/content/'></ContentPage>
        <SigningDone path='/signingDone/'></SigningDone>
        <NotFound default />
      </Router>
      
    </div>
  );
  
}

export default App;
