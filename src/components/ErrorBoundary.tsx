import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();

  let errorMessage: string;
  let statusText: string = "";
  let status: number | undefined;

  if (isRouteErrorResponse(error)) {
    // Error from React Router
    errorMessage = error.data?.message || error.statusText;
    statusText = error.statusText;
    status = error.status;
  } else if (error instanceof Error) {
    // JavaScript Error
    errorMessage = error.message;
  } else if (typeof error === "string") {
    // String error
    errorMessage = error;
  } else {
    // Unknown error
    errorMessage = "Unknown error occurred";
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-red-600">
          {status
            ? `${status} - ${statusText}`
            : "Unexpected Application Error!"}
        </h1>

        <p className="mb-6 text-gray-600">{errorMessage}</p>

        <div className="flex flex-col gap-4">
          <Button asChild className="bg-velo-red hover:bg-velo-black">
            <Link to="/">Return to Home</Link>
          </Button>

          {status === 401 && (
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
