import React from 'react';
import { Router, Routes, Route } from 'react-router-dom';

//imports components
import AuthApi from './AuthApi';
import Home from './Home';
import Signup from './auth/Signup';
import Login from './auth/Login';
import User from './users/User';
import UsersPage from './users/UsersPage';
import UpdateAccount from './users/UpdateAccount';
import DeleteAccount from './users/DeleteAccount';
import DeleteUserAccount from './users/DeleteUserAccount';
import Articles from './articles/Articles';
import ArticlePage from './articles/ArticlePage';
import CreateArticle from './articles/CreateArticle';
import UpdateArticle from './articles/UpdateArticle';
import DeleteArticle from './articles/DeleteArticle';
import DeleteComment from './comments/DeleteComment';
import ImageUpdate from './images/ImageUpdate';

const AllRoutes = () => {
    
    const Auth = React.useContext(AuthApi)

    return (
        <Routes>
            <ProtectedLogin path="/" exact component={Home} />
            <ProtectedLogin path="/signup" component={Signup} />
            <ProtectedLogin path="/login" component={Login} auth={Auth.auth} />
            <ProtectedRoute path="/articles" auth={Auth.auth} component={Articles} />
            <ProtectedRoute path="/user/:id" auth={Auth.auth} component={User} />
            <ProtectedRoute path="/userdelete/:id" auth={Auth.auth} component={DeleteAccount} />
            <Router path="/userupdate/:id" auth={Auth.auth} component={UpdateAccount} />
            <Router path="/users/:id" auth={Auth.auth} component={UsersPage} />
            <Router path="/createarticle" auth={Auth.auth} component={CreateArticle} />
            <Router path="/article/:id" auth={Auth.auth} component={ArticlePage} />
            <Router path="/articleupdate/:id" auth={Auth.auth} component={UpdateArticle} />
            <Router path="/articledelete/:id" auth={Auth.auth} component={DeleteArticle} />
            <Router path="/deletecomment/:id" auth={Auth.auth} component={DeleteComment} />
            <Router path="/imageupdate/:id" auth={Auth.auth} component={ImageUpdate} />
            <Router path="/adminuserdelete/:id" auth={Auth.auth} component={DeleteUserAccount} />
        </Routes>
    )
}

const ProtectedLogin = ({auth, component: Component, ...rest}) => {
    return(
        <Router 
        {...rest}
        render = {() => !auth? (
            <>
                <Component />
            </>
        ) :
            (
                <Route to="/articles" />
            )
            }
        />
    )
}

const ProtectedRoute = ({auth, component: Component, ...rest}) => {
    return(
        <Router 
        {...rest}
        render = {() => auth? (
            <>
                <Component />
            </>
        ) :
            (
                <Route to="/login" />
            )
            }
        />
    )
}

export default AllRoutes;