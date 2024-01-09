import React, { useState, useEffect } from 'react';
import MovieDataService from '../services/movies';
import { Link } from 'react-router-dom'
import movieDataService from '../services/movies';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Media from 'react-bootstrap/Media';
import moment from 'moment';

const Movie = props => {

    //-- we have a movie state variable to hold the specific movie we are currently showing in the Movie component
    //-- we set its initial values to null, empty strings or an empty array
    const [movie, setMovie] = useState({
        id: null,
        title: "",
        rated: "",
        reviews: []
    })

    //-- this method calls get() of MovieDataService
    const getMovie = id => {
        movieDataService.get(id)
            .then(response => {
                setMovie(response.data)
                console.log(response.data)
            })
            .catch(e => {
                console.log(e)
            })
    }

    //-- we provide props.match.params.id into the second argument array
    //-- this means that useEffect should be called when the component first renders,
    //   and also each time the value of props.match.params.id (which holds that movie id) changes

    //-- useEffect without a second argument, is called each time a state change occurs in its body
    //-- useEffect with an empty array in its second argument gets called only the first time the component renders
    //-- useEffect with a state variable in the array gets called each time the state variable changes
    useEffect(() => {
        getMovie(props.match.params.id)
    }, [props.match.params.id])

    //-- the delete endpoint is supported by apiDeleteReview in ReviewsController in the backend
    const deleteReview = (reviewId, index) => {
        MovieDataService.deleteReview(reviewId, props.user.id)
            .then(response => {
                setMovie((prevState) => {
                    prevState.reviews.splice(index, 1)
                    return ({
                        ...prevState
                    })
                })
            })
            .catch(e => {
                console.log(e)
            })
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Image src={movie.poster + '/100px250'} fluid></Image>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header as='h5'>{movie.title}</Card.Header>
                            <Card.Body>
                                <Card.Text>{movie.plot}</Card.Text>
                                {props.user &&
                                    <Link to={'/movies/' + props.match.params.id + '/review'}>Add Review</Link>
                                }
                            </Card.Body>
                        </Card>
                        <br></br>
                        <h2>Reviews</h2>
                        <br></br>
                        {movie.reviews.map((review, index) => {
                            return (
                                <Media key={index}>
                                    <Media.Body>
                                        <h5>{review.name + " reviewed on "} {moment(review.date).format("Do MMMM YYYY")}</h5>
                                        <p>{review.review}</p>
                                        {props.user && props.user.id === review.user_id &&
                                            <Row>
                                                <Col>
                                                    <Link to={{
                                                        pathname: '/movies/' +
                                                            props.match.params.id +
                                                            '/review',
                                                        state: { currentReview: review }
                                                    }}>Edit</Link>
                                                </Col>
                                                <Col>
                                                    <Button variant='link' onClick={() => deleteReview(review._id, index)}>Delete</Button>
                                                </Col>
                                            </Row>
                                        }
                                    </Media.Body>
                                </Media>
                            )
                        })}
                    </Col>
                </Row>
            </Container>
        </div>
    )

}

export default Movie;