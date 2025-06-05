import React, { useEffect, useState } from "react";

import { getFlatsByUserId } from "../services/FlatServices";

interface Flat {
  id?: string;
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string;
  userId: string;
}




export const MyFlatsPage = () => {
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlats = async () => {
      const userFlats = await getFlatsByUserId();
      setFlats(userFlats);
      setLoading(false);
    };

    loadFlats();
  }, []);

  if (loading) {
    return <div>Cargando tus flats...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Flats</h2>

      {flats.length === 0 ? (
        <p>No tienes ningún flat registrado.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {flats.map((flat) => (
            <li
              key={flat.id}
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: "1rem",
                marginBottom: "1rem",
              }}
            >
              <strong>City:</strong> {flat.city}
              <br />
              <strong>Street:</strong> {flat.streetName}, #{flat.streetNumber}
              <br />
              <strong>Area Size:</strong> {flat.areaSize} m²
              <br />
              <strong>Has AC:</strong> {flat.hasAC ? "Sí" : "No"}
              <br />
              <strong>Year Built:</strong> {flat.yearBuilt}
              <br />
              <strong>Rent Price:</strong> ${flat.rentPrice}
              <br />
              <strong>Date Available:</strong> {flat.dateAvailable}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
