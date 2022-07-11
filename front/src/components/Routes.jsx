import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

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

const Routes = () => {
    
    const Auth = React.useContext(AuthApi)

    return (
        <Switch>
            <ProtectedLogin path="/" exact component={Home} />
            <ProtectedLogin path="/signup" component={Signup} />
            <ProtectedLogin path="/login" component={Login} auth={Auth.auth} />
            <ProtectedRoute path="/articles" auth={Auth.auth} component={Articles} />
            <ProtectedRoute path="/user/:id" auth={Auth.auth} component={User} />
            <ProtectedRoute path="/userdelete/:id" auth={Auth.auth} component={DeleteAccount} />
            <Route path="/userupdate/:id" auth={Auth.auth} component={UpdateAccount} />
            <Route path="/users/:id" auth={Auth.auth} component={UsersPage} />
            <Route path="/createarticle" auth={Auth.auth} component={CreateArticle} />
            <Route path="/article/:id" auth={Auth.auth} component={ArticlePage} />
            <Route path="/articleupdate/:id" auth={Auth.auth} component={UpdateArticle} />
            <Route path="/articledelete/:id" auth={Auth.auth} component={DeleteArticle} />
            <Route path="/deletecomment/:id" auth={Auth.auth} component={DeleteComment} />
            <Route path="/imageupdate/:id" auth={Auth.auth} component={ImageUpdate} />
            <Route path="/adminuserdelete/:id" auth={Auth.auth} component={DeleteUserAccount} />
        </Switch>
    )
}

const ProtectedLogin = ({auth, component: Component, ...rest}) => {
    return(
        <Route 
        {...rest}
        render = {() => !auth? (
            <>
                <Component />
            </>
        ) :
            (
                <Redirect to="/articles" />
            )
            }
        />
    )
}

const ProtectedRoute = ({auth, component: Component, ...rest}) => {
    return(
        <Route 
        {...rest}
        render = {() => auth? (
            <>
                <Component />
            </>
        ) :
            (
                <Redirect to="/login" />
            )
            }
        />
    )
}

export default Routes;