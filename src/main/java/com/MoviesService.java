package com;

import com.dto.MovieDetailsDto;
import com.dto.MovieDto;
import com.dto.MoviesListDtoWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static com.Constants.ERROR_PULLING_MOVIES_API_LOG_MSG;

@Component
public class MoviesService {

    private static final Logger logger = LoggerFactory.getLogger(MoviesService.class);
    private static final String GET_MOVIES_FROM_OMDBAPI = "https://www.omdbapi.com/?apikey=bb182d9e&type=movie&s=";
    private static final String GET_MOVIE_DETAILS_FROM_OMDBAPI = "https://www.omdbapi.com/?apikey=bb182d9e&type=movie&i=";
    private RestTemplate restTemplate;

    public MoviesService() {
        this.restTemplate = new RestTemplate();
    }

    public List<MovieDto> getMovies(String name) {
        return getMoviesRespWrapper(name).getMoviesArray();
    }

    private MoviesListDtoWrapper getMoviesRespWrapper(String name) {
        return getMoviesResp(name).getBody();
    }

    private ResponseEntity<MoviesListDtoWrapper> getMoviesResp(String name) {
        ResponseEntity<MoviesListDtoWrapper> response = restTemplate
                .getForEntity(GET_MOVIES_FROM_OMDBAPI + name, MoviesListDtoWrapper.class);
        if (response.getStatusCode() != HttpStatus.OK) {
            logger.error(ERROR_PULLING_MOVIES_API_LOG_MSG, response.getStatusCode());
        }
        return response;
    }

    public ResponseEntity<MovieDetailsDto> getMovieDetails(String imdbID) {
        ResponseEntity<MovieDetailsDto> response = restTemplate
                .getForEntity(GET_MOVIE_DETAILS_FROM_OMDBAPI + imdbID, MovieDetailsDto.class);
        if (response.getStatusCode() != HttpStatus.OK) {
            logger.error(ERROR_PULLING_MOVIES_API_LOG_MSG, response.getStatusCode());
        }
        return response;
    }
}
