import React from 'react' ; 

const Login = () => {
  return(
    <div>
       <Logo/>
       <h1>Connexion</h1>
       <form>
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" required/>
          </div>
          <div>
            <label for="password">Password</label>
            <input type="password" id="password" required/>
          </div>
       </form>
    </div>
  );
};

export default Login;