import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Moment from 'react-moment';
import img from '../../images/icon.png';
import AuthApi from '../AuthApi';
import Cookies from 'js-cookie';

const User = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState([]);
    const [articles, setArticle] = useState([]);
    const navigate = useNavigate();

    const storage = JSON.parse(localStorage.getItem('userConnect'));
    const userId = storage.userId;
    let token = "Bearer " +  storage.token;

    useEffect(() => {
      fetch("http://localhost:3000/api/users/" + userId,
        {headers: 
            {"Authorization" : token}
        })
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setUser(result);
                localStorage.setItem('userAccount', JSON.stringify(result));
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, [userId, token])

    useEffect(() => {
        fetch("http://localhost:3000/api/users/" + userId + "/articles/" ,
            {headers: 
                {"Authorization" : token},
            })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setArticle(result.data);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }, [userId, token])

    const Auth = React.useContext(AuthApi);

    const handleOnclick = () => {
        Auth.setAuth(false);
        Cookies.remove("user");
        localStorage.clear();
    }

    let idUser;
    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Chargement...</div>;
    } else if (user.id === userId || user.isAdmin === true) {
        idUser = <div className="user-button">
            <button className="btn btn-outline-info btn-sm" onClick={() => {navigate("/userupdate/" + userId)}}>Modifier</button>
            <button className="btn btn-outline-danger btn-sm" onClick={() => {navigate("/userdelete/" + userId)}}>Supprimer</button>
            <button className="btn btn-outline-dark btn-sm" onClick={handleOnclick}>Déconnecter</button>  
        </div>
    }

    return (
        <React.Fragment>
            <div className="container">
                <h1>Bienvenue {user.firstname} !</h1>
                {storage.userAdmin === true ?
                <p>Compte Administrateur</p> : <></>}
                <div className="user-page">
                    <div className="images">
                    {user.imageUrl ?
                    <img
                        src={"http://localhost:3000/images/" + user.imageUrl}
                        alt="user"
                        key={"userImage" + user.id}
                    /> : 
                    <img
                        src={img}
                        alt="user"
                        key={"userImage" + user.id}
                    />
                    }
                        <button className="btn btn-outline-info btn-sm" onClick={() => {navigate("/imageupdate/" + userId)}}>Modifier</button>
                    </div>
                    <div className= "show-article">
                        <h2>{user.firstname} {user.lastname}</h2>
                        <p>{user.bio}</p>
                    </div>
                    {idUser}
                </div>
                <div className="user-article">
                    <h2>Vos articles</h2>
                    {articles.map((article) => (
                        <div className="user-articles" key={"user" + article.id}>
                            <Link to={"/article/" + article.id} key={"article" + article.id} className="nav-link">{article.title}</Link>
                            <p key={"articlep" + article.id}>{article.content}</p>
                            <h3 key={"date" + article.id}>Publié le <Moment key={"date" + article.id} format="DD MMM YYYY" date={article.createdAt} /></h3>
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};

export default User;