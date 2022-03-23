package com.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MovieDto {
    public String imdbID;
    @JsonProperty("Poster")
    public String poster;
    @JsonProperty("Title")
    public String title;
    @JsonProperty("Year")
    public String year;
}

