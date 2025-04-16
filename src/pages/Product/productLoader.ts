import { currentToken, currentUser } from "@/redux/features/auth/authSlice";
import { store } from "@/redux/store";
import { LoaderFunctionArgs } from "react-router-dom";

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  interface User {
    name?: string;
    email?: string;
    role?: string;
    id?: string;
    [key: string]: unknown;
  }

  const id = params.id;
  console.log(`Fetching car with ID: ${id}`);
  const state = store.getState();
  const user = currentUser(state) as User;
  console.log(user);
  const token = currentToken(state);
  console.log("token", token);

  if (!token) {
    alert("Unauthorized: You must be logged in to view this product.");
    throw new Error("User is not authenticated.");
  }

  try {
    const response = await fetch(
      `https://velocity-backend.vercel.app/api/cars/${id}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      alert(
        `Error ${response.status}: ${errorText || "Failed to fetch car details."}`,
      );
      throw new Error(errorText || "Failed to fetch car data");
    }

    const json = await response.json();
    console.log("Car data successfully loaded:", json);
    return { data: json.data }; // return only the car object
  } catch (error) {
    alert("Something went wrong while fetching the product data.");
    console.error("Loader Error:", error);
    throw error;
  }
};
