import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import Moment from 'react-moment';
import Comments from "../comments/Comments";
import Badge from 'react-bootstrap/Badge'
import img from '../../images/icon.png';


function ArticlePage ({ match }) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [article, setArticle] = useState([]);

    const [likes, setLikes] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const storage = JSON.parse(localStorage.getItem('userConnect'));
    let token = "Bearer " +  storage.token;
    let userId = storage.userId;
    
    let articleId = match.params.id;

    useEffect(() => {
      fetch("http://localhost:3000/api/articles/" + articleId, 
        {headers: 
            {"Authorization" : token}
        })
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setArticle(result);
                localStorage.setItem('articlePage', JSON.stringify(result));
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, [articleId, token])

    useEffect(() => {
        fetch("http://localhost:3000/api/users/", 
            {headers: 
                {"Authorization" : token}
            })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setUsers(result.data);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }, [token])

    useEffect(() => {
        fetch("http://localhost:3000/api/articles/" + articleId + "/likes/" ,
            {headers: 
                {"Authorization" : token},
            })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setLikes(result.data.length);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }, [articleId, token])

    function LikeSubmit () {
        fetch('http://localhost:3000/api/likes/', {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                articleId: articleId,
                userId: userId,
                like: 1
            })
        })
        .then(res => res.json())
        .then(
            (result) => {
                setLikes(result.like)
                setIsLoaded(true);
        }, (error) => {
            if(error) {
                setError(error);
            }
        })
    }    

    let userAuth;
    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Chargement...</div>;
    } else if (article.userId === storage.userId) {
        userAuth = <div className="article-button">
            <button className="btn btn-outline-info btn-sm" onClick={() => {navigate("/articleupdate/" + articleId)}}>Modifier</button>
            <button className="btn btn-outline-danger btn-sm" onClick={() => {navigate("/articledelete/" + articleId)}}>Supprimer</button>
        </div>
    } else if (storage.userAdmin === true){
        userAuth = <div className="article-button">
            <button className="btn btn-outline-danger btn-sm" onClick={() => {navigate("/articledelete/" + articleId)}}>Supprimer</button>
        </div>
    }

    return (
        <React.Fragment>
            <div className="container">
                <h1>{article.title} </h1>
                <div className="article-present">
                    {users.map((user) => {
                        if (user.id === article.userId && user.imageUrl) {
                        return <img src={"http://localhost:3000/images/" + user.imageUrl} alt="user" key={"userImage" + article.id} />
                        } else if (user.id === article.userId && !user.imageUrl) {
                            return <img src={img} alt="user" key={"userImage" + article.id} />
                        } else {
                            return null
                        }
                    })}
                    <div className="article-content">
                        {users.map((user) =>
                            {
                            if(article.userId === user.id){
                            return <h2 key={"h2" +user.id}>Publié par <Link to={"/users/" + user.id} key={user.id + article.id} className="nav-link">{user.firstname} {user.lastname}</Link></h2>
                            } else {
                                return null
                            }
                        })}
                        <p><Moment fromNow key={"date" + article.id}>{article.createdAt}</Moment></p>
                        <div className="article-page">
                            <div className= "show-article">
                                <p>{article.content}</p>
                                {article.articleUrl
                                ? <a target="_blank" rel="noopener noreferrer" className="nav-link" href={article.articleUrl} >{article.articleUrl}</a> : null}
                            </div>
                            {userAuth}
                        </div>
                        <div className="likes">
                        <button onClick={LikeSubmit}>
                            <Badge  pill variant="danger">
                                Likes : {likes}
                            </Badge>
                        </button>
                        </div>
                    </div>
                </div>
                <Comments />
            </div>
        </React.Fragment>
    );
};

export default ArticlePage;