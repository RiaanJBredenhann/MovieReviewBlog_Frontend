import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "bootstrap/dist/css/bootstrap.min.css";

import AddReview from './components/add-review';
import Login from './components/login';
import MoviesList from './components/movies-list';
import Movie from './components/movie';

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <div className="App">
      <Navbar bg='light' expand='lg'>
        <Navbar.Brand href='#home'>Movie Reviews</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav'></Navbar.Toggle>
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <Nav.Link>
              <Link to={'/movies'}>Movies</Link>
            </Nav.Link>
            <Nav.Link>
              {user ? (
                <a onClick={logout}>Logout User</a>
              ) : (
                <Link to={'/login'}>Login</Link>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route exact path={['/', '/movies']} component={MoviesList}></Route>
        {/* we use render instead of component because render allows us
            to pass in props into a component rendered by React Router */}
        <Route path="/movies/:id/review" render={(props) =>
          <AddReview {...props} user={user} />
        }>
        </Route>
        <Route path="/movies/:id/" render={(props) =>
          <Movie {...props} user={user} />
        }>
        </Route>
        <Route path="/login" render={(props) =>
          <Login {...props} login={login} />
        }>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
