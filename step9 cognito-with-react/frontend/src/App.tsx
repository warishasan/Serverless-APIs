import React from 'react';
import { Amplify, API, Auth } from 'aws-amplify';
import { AwsConfigAuth } from './config/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
Amplify.configure({ Auth: AwsConfigAuth });

function App() {
  return (
    <div className="App">
      <Authenticator signUpAttributes={["email", "phone_number"]}>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user?.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
    </div>
  );
}
export default App;
