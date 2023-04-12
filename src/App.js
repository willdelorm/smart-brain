import ParticlesBg from "particles-bg";

import FaceRecognition from "./components/face-recognition/FaceRecognition";
import ImageLinkForm from "./components/image-link-form/ImageLinkForm";
import Logo from "./components/logo/Logo";
import Navigation from "./components/navigation/Navigation";
import SignIn from "./components/sign-in/SignIn";
import Rank from "./components/rank/Rank";
import Register from "./components/register/Register";

import "./App.css";
import { useState } from "react";

const setRequestOptions = (imageUrl) => {
  const PAT = "3fad6da1cad14f3b987d47b2813e5553";
  const USER_ID = "willdelorm";
  const APP_ID = "smart-brain";
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

function App() {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState({});
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({});

  const calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    setImageUrl(input);

    fetch(
      "https://api.clarifai.com/v2/models/face-detection/outputs",
      setRequestOptions(input)
    )
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              setUser({ ...user, entries: count });
            });
        }
        displayFaceBox(calculateFaceLocation(result));
      })
      .catch((error) => console.log("error", error));
  };

  const handleRouteChange = (route) => {
    if (route === "signout") {
      setIsSignedIn(false);
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  const loadUser = (user) => {
    const { id, name, email, entries, joined } = user;
    setUser({
      id,
      name,
      email,
      entries,
      joined,
    });
  };

  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} num={30} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={handleRouteChange} />
      {route === "home" ? (
        <>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </>
      ) : route === "signin" ? (
        <SignIn loadUser={loadUser} onRouteChange={handleRouteChange} />
      ) : (
        <Register loadUser={loadUser} onRouteChange={handleRouteChange} />
      )}
    </div>
  );
}

export default App;
