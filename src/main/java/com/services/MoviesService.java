package com.services;

import com.dto.MovieDetailsDto;
import com.dto.MovieDto;
import com.dto.MoviesListDtoWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static com.Constants.ERROR_BLOOD_TEST_CONFIG_PULLING_API_MSG;

@Component
@Service
public class MoviesService {

    public static final String GET_MOVIES_FROM_OMDBAPI = "https://www.omdbapi.com/?apikey=bb182d9e&type=movie&s=";

    private RestTemplate restTemplate;

//    @Autowired
//    private Environment environment;

    private static final Logger logger = LoggerFactory.getLogger(MoviesService.class);

    public MoviesService() {
        this.restTemplate = new RestTemplate();
//        this.apiKeyValue = environment.getProperty(API_KEY_NAME);
    }

    public List<MovieDto> getMovies(String name) {
        return getMoviesWrapper(name).getMoviesArray();
    }

    private MoviesListDtoWrapper getMoviesWrapper(String name) {
        return getBloodTestConfigJsonHelper(name).getBody();
    }

    private ResponseEntity<MoviesListDtoWrapper> getBloodTestConfigJsonHelper(String name) {
        ResponseEntity<MoviesListDtoWrapper> response = restTemplate
                .getForEntity(GET_MOVIES_FROM_OMDBAPI + name, MoviesListDtoWrapper.class);
        if (response.getStatusCode() != HttpStatus.OK) {
            logger.error(ERROR_BLOOD_TEST_CONFIG_PULLING_API_MSG, response.getStatusCode());
        }
        return response;
    }

    public ResponseEntity<MovieDetailsDto> getMovieDetails(String imdbID) {
        ResponseEntity<MovieDetailsDto> response = restTemplate
                .getForEntity(
//                        GET_MOVIES_FROM_OMDBAPI + apiKeyValue + "&i=tt1285016&type=movie",
                        "https://www.omdbapi.com/?apikey=bb182d9e&type=movie&s=new york",
                        MovieDetailsDto.class);
        if (response.getStatusCode() != HttpStatus.OK) {
            logger.error(ERROR_BLOOD_TEST_CONFIG_PULLING_API_MSG, response.getStatusCode());
        }
        return response;
    }
}
