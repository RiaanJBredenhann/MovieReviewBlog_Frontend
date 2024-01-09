// we use a library called axios for sending get, post, put and delete request
import axios from 'axios';

class MovieDataService {

    // returns all the movies for a particular page
    getAll(page = 0) {
        return axios.get(`https://movie-review-blog-backend-riaan.onrender.com/api/v1/movies?page=${page}`);
        // return axios.get(`http://localhost:5000/api/v1/movies?page=${page}`);
    }

    // gets the specific movie with the supplied id
    get(id) {
        return axios.get(`https://movie-review-blog-backend-riaan.onrender.com/api/v1/movies/id/${id}`);
        // return axios.get(`http://localhost:5000/api/v1/movies/id/${id}`);
    }

    // connects to the same endpoint as getAll except that it has query which consists 
    // of the user-entered search title, ratings (e.g. ‘G’) and page number
    find(query, by = 'title', page = 0) {
        return axios.get(`https://movie-review-blog-backend-riaan.onrender.com/api/v1/movies?${by}=${query}&page=${page}`);
        // return axios.get(`http://localhost:5000/api/v1/movies?${by}=${query}&page=${page}`);
    }

    createReview(data) {
        return axios.post("https://movie-review-blog-backend-riaan.onrender.com/api/v1/movies/review", data);
        // return axios.post("http://localhost:5000/api/v1/movies/review", data);
    }

    updateReview(data) {
        return axios.put("https://movie-review-blog-backend-riaan.onrender.com/api/v1/movies/review", data);
        // return axios.put("http://localhost:5000/api/v1/movies/review", data);
    }

    deleteReview(id, userId) {
        return axios.delete(
            "https://movie-review-blog-backend-riaan.onrender.com/api/v1/movies/review",
            { data: { review_id: id, user_id: userId } }
        );
        // return axios.delete("http://localhost:5000/api/v1/movies/review",{ data: { review_id: id, user_id: userId } });
    }

    getRatings() {
        return axios.get("https://movie-review-blog-backend-riaan.onrender.com/api/v1/movies/ratings")
        // return axios.get("http://localhost:5000/api/v1/movies/ratings")
    }

}

const movieDataService = new MovieDataService();
export default movieDataService;