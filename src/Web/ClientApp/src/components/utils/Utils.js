import { SwaggerException } from "../../web-api-client.ts";

export const MovieGenres = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  ScienceFiction: 878,
  TVMovie: 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

export const processApiResponse = async (apiCall) => {
  try {
    // Execute the API call
    const response = await apiCall;

    // Return the response if successful
    return response;
  } catch (error) {
    // Handle errors based on HTTP status codes
    if (error instanceof SwaggerException) {
      const statusCode = error.status;

      if (statusCode === 401) {
        // Redirect to login page if the user is not authenticated
        window.location.href = "/Identity/Account/Login";
      } else if (statusCode === 500) {
        // Redirect to server error page with error details
        const errorDetails = encodeURIComponent(
          JSON.stringify({
            message: error.message,
            status: error.status,
            details: error.response,
          })
        );
        console.log(error);
        // window.location.href = `/server-error?error=${errorDetails}`;
      } else {
        // Log unexpected errors
        console.error("An unexpected error occurred:", error);
      }
    } else {
      // Handle network or other unexpected errors
      console.error("A network error occurred:", error);
    }

    // Re-throw the error to allow further handling if needed
    throw error;
  }
};
