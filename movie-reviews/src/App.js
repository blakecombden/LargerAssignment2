import './App.css';
import React, {useState, useEffect} from "react";
import {LeaveReview} from './Form';
import {Routes, Route} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {ListGroup} from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function MovieList(props) {
    const remove = (title) => {
        props.setMovies(props.movies.filter((movie) => movie.title !== title));

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        let urlencoded = new URLSearchParams();
        urlencoded.append("title", title);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("/api/removeMovie", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

  return (
      <div class="wrapper">
          <Card style={{ width: '99rem' }}>
              <Card.Body>
                  <Card.Title style={{ color: 'blue'}}>Blake's Movie Reviews</Card.Title>
                  <Card.Text>
                      Click "Remove" to remove a movie from the list. Click "Review" to add your own review.
                  </Card.Text>
                  <Nav className='justify-content-center' variant="pills" defaultActiveKey="/review">
                      <Nav.Item>
                          <Nav.Link href="/review">Review</Nav.Link>
                      </Nav.Item>
                  </Nav>
              </Card.Body>
          </Card>

      <ul>
        {
          props.movies.map(movie =>
              <ul>
                  <br></br>
                  <img src={movie.image} style={{height:"300px"}} alt={movie.image} />
                  <Row>
                      <Col></Col>
                      <Col>
                  <ListGroup as="ul">
                      <ListGroup.Item as="li">{movie.title}</ListGroup.Item>
                      <ListGroup.Item as="li">Release Date: {movie.releaseDate}</ListGroup.Item>
                      <ListGroup.Item as="li">Starring: {movie.actors}</ListGroup.Item>
                      <ListGroup.Item as="li">Rating: {movie.rating}</ListGroup.Item>
                  </ListGroup>
                      </Col>
                      <Col></Col>
                  </Row>
                  <Button variant="danger" onClick={() => remove(movie.title)}>Remove</Button>
                  <hr></hr>
              </ul>)
        }
      </ul>
      </div>
  )
}

function App() {

  let [movies, setMovies] = useState(null);

  useEffect(() => {
    fetch("/api/movies")
        .then(response => response.json())
        .then(setMovies)
        .catch(e => console.log(e.message()))
  }, []);

  if (movies == null) {
    return<h1>Loading...</h1>
  }

  return (
      <Routes>
          <Route path="/" element={<MovieList movies={movies} setMovies={setMovies}/>} />
          <Route path="/review" element={<LeaveReview movies={movies} setMovies={setMovies}/>} />
      </Routes>
  )
}
export default App;