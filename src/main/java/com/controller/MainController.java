package com.controller;


import com.Routes;
import com.dto.MovieDetailsDto;
import com.dto.MovieDto;
import com.services.MoviesService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

import java.util.List;

import static com.Constants.ERROR_GET_MOVIES_API_MSG;
import static com.Constants.MODAL_MAP_ERRORS;
import static com.Constants.MODAL_MAP_RESULT;

@RestController
public class MainController {

	private final Logger logger = LoggerFactory.getLogger(MainController.class);

	@Autowired
	private MoviesService moviesService;

	@GetMapping(value = Routes.GET_MOVIES_FOR_SEARCH)
	public ModelMap getMovies(HttpServletRequest request, @PathVariable("name") String name) {
		ModelMap model = new ModelMap();

		try {
			List<MovieDto> moviesDtoList = moviesService.getMovies(name);
			model.addAttribute(MODAL_MAP_RESULT, moviesDtoList);
		} catch (Exception e) {
			model.addAttribute(MODAL_MAP_ERRORS, e.getMessage());
			logger.error(ERROR_GET_MOVIES_API_MSG, e.getMessage());
		}

		return model;
	}

	@GetMapping(value = Routes.GET_MOVIE_DETAILS)
	public ModelMap getMovieDetails(HttpServletRequest request, @PathVariable("imdbID") String imdbID) {
		ModelMap model = new ModelMap();

		try {
			MovieDetailsDto movieDetailsDto = moviesService.getMovieDetails(imdbID).getBody();
			model.addAttribute(MODAL_MAP_RESULT, movieDetailsDto);
		} catch (Exception e) {
			model.addAttribute(MODAL_MAP_ERRORS, e.getMessage());
			logger.error(ERROR_GET_MOVIES_API_MSG, e.getMessage());
		}

		return model;
	}
}
