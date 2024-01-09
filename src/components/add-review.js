import React, { useState } from 'react';
import MovieDataService from '../services/movies'
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddReview = props => {

    //-- the editing boolean variable will be set to true if the component is in 'editing' mode
    //   false means we are adding a review
    let editing = false;
    let initialReviewState = "";

    //-- if we are currently editing a review
    if (props.location.state && props.location.state.currentReview) {
        editing = true
        initialReviewState = props.location.state.currentReview.review
    }

    const [review, setReview] = useState(initialReviewState);
    const [submitted, setSubmitted] = useState(false);

    //-- keeps track of the user-entered review value in the field
    const onChangeReview = e => {
        const review = e.target.value;
        setReview(review);
    }

    //-- is called by the submit button’s onClick={saveReview}
    //   we first create a data object containing the review's properties
    //   we get name and user_id from props as this is passed into the AddReview component back in App.js
    //   we get movie_id (movie_id: props.match.params.id) direct from the url back in movie.js
    const saveReview = () => {
        var data = {
            review: review,
            name: props.user.name,
            user_id: props.user.id,
            movie_id: props.match.params.id // get movie_id directly from url
        }
        if (editing) {
            // get existing review id
            data.review_id = props.location.state.currentReview._id
            MovieDataService.updateReview(data)
                .then(response => {
                    setSubmitted(true);
                    console.log(response.data)
                })
                .catch(e => {
                    console.log(e);
                })
        }
        else {
            //-- this methid routes to ReviewsController in our backend and calls apiPostReview 
            //   which then extracts data from the request's body parameter
            MovieDataService.createReview(data)
                .then(response => {
                    setSubmitted(true);
                })
                .catch(e => {
                    console.log(e)
                })
            }
        }


        return (
            <div>
                {submitted ? (
                    <div>
                        <h4>Review submitted successfully</h4>
                        <Link to={'/movies/' + props.match.params.id}>Back to Movie</Link>
                    </div>
                ) : (
                    <Form>
                        <Form.Group>
                            <Form.Label>{editing ? "Edit" : "Create"}</Form.Label>
                            <Form.Control
                                type='text'
                                required
                                value={review}
                                onChange={onChangeReview}>
                            </Form.Control>
                        </Form.Group>
                        <Button variant='primary' onClick={saveReview}>Submit</Button>
                    </Form>
                )}
            </div>
        )

    }

    export default AddReview;