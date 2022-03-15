package com;

public class Routes {

    private Routes() { }

    // UI API Call
    public static final String GET_MOVIES_FOR_SEARCH = "/get_movies/{name}";
    public static final String GET_MOVIE_DETAILS = "/get_movie_details/{imdbID}";

    //s3 API CALL
    public static final String GET_MOVIES = "https://www.omdbapi.com/?apikey=bb182d9e&i=tt1285016&type=movie";
}
