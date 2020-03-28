import React, { useState, useEffect } from "react";
import "./Machines.css";
import MapGL, { Marker, Popup } from "react-map-gl";
//shows if point inside boundary based on ray-casting algorithm
import inside from "point-in-polygon";

// Set your mapbox token here
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYmFiczEyMzE2IiwiYSI6ImNrOGJtNnA4cTBjeGIzZXFmZHNiMWw1eTQifQ.o8iB_zR1QPq9yX6LV01iZg";

// Boundary defined in lan and lat
const boundary = [
  [48.1413611, 11.51988888888889],
  [48.1441111, 11.51988888888889],
  [48.1441111, 11.527277777777778],
  [48.1413611, 11.527277777777778]
];

const Machines = () => {
  // all the information about assets
  const [machines, setMachines] = useState([]);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // shows an clicked  asset in Map
  const [selectedMachine, setSelectedMachine] = useState(null);

  // sets attribute for map
  const [viewport, setViewport] = useState({
    latitude: 48.13825988769531,
    longitude: 11.584508895874023,
    zoom: 12
  });

  useEffect(() => {
    const fetchMachinesData = async () => {
      //set Error false for every fresh API call
      setError(false);
      // set loading Before API operation starts
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8081/machines");
        const data = await res.json();
        setMachines(data);
       // console.log("hello" + JSON.stringify(data));
      } catch {
        setError(true);
        console.log(error);
      }
      // After API operation end
      setLoading(false);
    };
    fetchMachinesData();

    //Fetch data after every 10 seconds
    setInterval(function() {
      fetchMachinesData();
    }, 10000);
    // eslint-disable-next-line
  }, []);
  return (
    <div className="assets-map">
      {loading && <h2 style={{ color: `green` }}>fetching Map </h2>}

      <MapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        {machines.map(machine => (
          <Marker
            key={machine.id}
            latitude={machine.location.latitude}
            longitude={machine.location.longitude}
          >
            <button
              className={
                inside(
                  [machine.location.latitude, machine.location.longitude],
                  boundary
                )
                  ? "not-stolen"
                  : "stolen"
              }
              onClick={e => {
                e.preventDefault();
                setSelectedMachine(machine);
              }}
            >
              <img src="/excavator.svg" alt="Crane Icon"></img>
            </button>
          </Marker>
        ))}

        {selectedMachine ? (
          <Popup
            latitude={selectedMachine.location.latitude}
            longitude={selectedMachine.location.longitude}
            onClose={() => {
              setSelectedMachine(null);
            }}
          >
            <p>
              Make:<span>{selectedMachine.model.make}</span>
              Model:<span>{selectedMachine.model.model}</span>
              Category:<span>{selectedMachine.model.category}</span>
              Serial Number:<span>{selectedMachine.serial_number}</span>
            </p>
          </Popup>
        ) : null}
      </MapGL>

      <div id="copyright">
        Icons made by{" "}
        <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
          Freepik
        </a>{" "}
        from{" "}
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>
      </div>
    </div>
  );
};

export default Machines;
