// UI imports
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';

// Authentication imports
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

// Google configuration
// webClientId from authentication => sign-in method => Google => web SDK configuration
GoogleSignin.configure({
  webClientId:
    '204482095469-u7kddmntorpjuffd2khkgkbm4gsqo8sa.apps.googleusercontent.com',
});

// Google authentication
async function onGoogleButtonPress() {
  // Get the users ID token
  const {idToken} = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth()
    .signInWithCredential(googleCredential)
    .catch(error => {
      console.log(error);
    });
}

export default function Login({navigation}) {
  // Authentication states
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Auth state change handler
  function onAuthStateChanged(user) {
    setUser(user);
    if (user) navigation.navigate('HomeBottomTabs');
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // Constant authentication change watcher
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // If initializing app
  if (initializing) return null;
  if (user) return null;

  return (
    // Container
    <View style={styles.container}>
      {/* Top Image*/}
      <View style={{width: '100%', borderWidth: 0, height: '48.3%'}}>
        <Image
          style={styles.image}
          source={require('../assets/img/hive.png')}
          resizeMode={'cover'}
        />
      </View>

      {/* App name + Google auth button */}
      <View
        style={{
          justifyContent: 'space-evenly',
          height: '51.7%',
        }}>
        {/* App Name */}
        <Text style={styles.appNameText}>BeeSafe</Text>

        {/* Register/Sign in with Google button*/}
        <LinearGradient
          colors={['#F09819', '#F09819', '#EDDE5D']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.authButtonContainer}>
          <TouchableOpacity
            style={[
              styles.loginButton,
              {borderRadius: 15, flexDirection: 'row'},
            ]}
            onPress={() => {
              onGoogleButtonPress();
            }}>
            <Icon name="google" size={15} style={{marginRight: 5}} />
            <Text style={styles.authButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
  },
  // Top image
  image: {
    width: '100%',
    height: '100%',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  // App name text
  appNameText: {
    fontSize: 40,
    lineHeight: 49,
    color: '#F0991A',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  // Google auth button
  loginButton: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Auth button container
  authButtonContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
    width: '57.24%',
    borderRadius: 15,
  },
  // Authentication button text
  authButtonText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 22,
  },
});
