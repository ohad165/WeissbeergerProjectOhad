package com.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

public class MoviesListDtoWrapper {
    @JsonProperty("Search")
    public ArrayList<MovieDto> search;

    public ArrayList<MovieDto> getMoviesArray() {
        return search;
    }
}
