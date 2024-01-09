import React, { useState, useEffect } from 'react';
import MovieDataService from '../services/movies';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

//-- functional component that receives and uses props
//-- we use the React useState hook to create the movies, searchTitle, searchRating and ratings state variables
//-- the searchTitle and searchRating state variables keep track of what
//   a user has entered into the search form fields in the Movies List page
const MoviesList = props => {

    const [movies, setMovies] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchRating, setSearchRating] = useState("");
    const [ratings, setRatings] = useState(["All Ratings"]);
    const [currentPage, setCurrentPage] = useState(0);
    const [entriesPerPage, setEntriesPerPage] = useState(0);
    const [currentSearchMode, setCurrentSearchMode] = useState("");

    //-- we declare a new state variable currentSearchMode which 
    //   contains the value either "", "findByTitle" or "findByRating
    //-- we add a useEffect that whenever currentSearchMode changes, 
    //   reset the currentPage to zero since it's a new search
    useEffect(() => {
        setCurrentPage(0)
    }, [currentSearchMode])

    //-- because we specified currentPage in the 2nd argument array, each time currentPage changes in value,
    //   this useEffect will be trigged and call retrieveMovies with the updated currentPage value
    useEffect(() => {
        retrieveNextPage()
    }, [currentPage])

    //-- the useEffect hook is called after the component renders
    //-- so if we want to tell the component to perform some code after rendering, we include it here
    //-- in our case, after the component renders, we want to retrieve movies and ratings
    //-- we specify an empty array in the second argument of the method so that its only called once
    useEffect(() => {
        //retrieveMovies()
        retrieveRatings()
    }, [])

    //-- calls MovieDataService.getAll()
    //-- getAll returns a promise with the movies retrieved from the database 
    //   and we set it to the movies state variable with setMovies(response.data.movies)
    //-- we also setCurrentPage and setEntriesPerPage
    const retrieveMovies = () => {
        setCurrentSearchMode("")
        MovieDataService.getAll(currentPage)
            .then(response => {
                console.log(response.data)
                setMovies(response.data.movies)
                setCurrentPage(response.data.page)
                setEntriesPerPage(response.data.entries_per_page)
            })
            .catch(e => {
                console.log(e)
            })
    }

    //-- calls MovieDataService.getRatings to get the list of distinct ratings from the database
    const retrieveRatings = () => {
        MovieDataService.getRatings()
            .then(response => {
                console.log(response.data)
                setRatings(["All Ratings"].concat(response.data))
            })
            .catch(e => {
                console.log(e)
            })
    }

    //-- depending on the currentSearchMode, this method calls the relevant retrieval functions
    const retrieveNextPage = () => {
        if (currentSearchMode === "find by title")
            findByTitle()
        else if (currentSearchMode === "find by rating")
            findByRating()
        else
            retrieveMovies()
    }

    //-- will be called whenever a user types into the search title field 
    //   and will then take the entered value and set it to the component state
    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    }

    //-- will be called whenever a user types into the search rating field 
    //   and will then take the entered value and set it to the component state
    const onChangeSearchRating = e => {
        const searchRating = e.target.value;
        setSearchRating(searchRating);
    }

    //-- the find function is supported by the findByTitle and findByRating methods
    //-- find simply provides the search query value entered by the user 
    //   and by which field to search (i.e. title or rated) to MovieDataService.find
    const find = (query, by) => {
        MovieDataService.find(query, by, currentPage)
            .then(response => {
                console.log(response.data);
                setMovies(response.data.movies);
            })
            .catch(e => {
                console.log(e)
            })
    }

    //-- findByTitle is called by the "Search by title" search button
    //-- it provides the title value to be searched to find() and tells it to search by "title"
    const findByTitle = () => {
        setCurrentSearchMode("findByTitle")
        find(searchTitle, "title")
    }

    //-- findByRating is called by the "Search by rating" search button
    //-- it provides the rating value to be searched to find() and tells it to search by "rated".
    //-- however, if the user did not specify any rating value, 
    //   the search value defaults to "All Ratings" and simply retrieves all movies
    const findByRating = () => {
        setCurrentSearchMode("findByRating")
        if (searchRating === "All Ratings") {
            retrieveMovies();
        }
        else {
            find(searchRating, "rated");
        }
    }

    return (
        <div className="App">
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by title"
                                    value={searchTitle}
                                    onChange={onChangeSearchTitle}
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="button"
                                onClick={findByTitle}
                            >
                                Search
                            </Button>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Control
                                    as="select" onChange={onChangeSearchRating} >
                                    {ratings.map(rating => {
                                        return (
                                            <option value={rating}>{rating}</option>
                                        )
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="button"
                                onClick={findByRating}
                            >
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Row>
                    {movies.map((movie) => {
                        return (
                            <Col>
                                <Card style={{ width: '18rem' }}>
                                    <Card.Img src={movie.poster + "/100px180"} />
                                    <Card.Body>
                                        <Card.Title>{movie.title}</Card.Title>
                                        <Card.Text>Rating: {movie.rated}</Card.Text>
                                        <Card.Text>{movie.plot}</Card.Text>
                                        <Link to={"/movies/" + movie._id} >View Reviews</Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
                <br />
                Showing page: {currentPage}.
                <Button
                    variant="link"
                    onClick={() => { setCurrentPage(currentPage + 1) }}
                >
                    Get next {entriesPerPage} results
                </Button>
            </Container>
        </div>
    );

}

export default MoviesList;