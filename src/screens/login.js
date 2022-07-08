import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';

GoogleSignin.configure({
  webClientId:
    '204482095469-u7kddmntorpjuffd2khkgkbm4gsqo8sa.apps.googleusercontent.com',
});

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
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [error, setError] = useState('');

  function onAuthStateChanged(user) {
    setUser(user);
    if (user) navigation.navigate('HomeBottomTabs');
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const signIn = () => {
    var mail = email;
    var pword = password;
    console.log(mail + ' ' + pword);
    auth()
      .signInWithEmailAndPassword(mail, pword)
      .then(() => {
        setEmail(null);
        setPassword(null);
        setError();
        console.log('User is signed in!');
        navigation.navigate('HomeBottomTabs');
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          setError('User is not found. Please register.');
          console.log('User not found!');
        }

        if (error.code === 'auth/invalid-email') {
          setError('Email is not a valid. Please check email.');
          console.log('Invalid email!');
        }

        if (error.code === 'auth/wrong-password') {
          setError('Password is incorrect. Please check password.');
          console.log('Wrong password!');
        }
      });
  };

  if (initializing) return null;

  if (user) return null;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Top Image*/}
          <View style={{width: '100%', borderWidth: 0, height: '48.3%'}}>
            <Image
              style={styles.image}
              source={require('../assets/img/hive.png')}
              resizeMode={'cover'}
            />
          </View>

          <View
            style={{
              justifyContent: 'space-evenly',
              height: '51.7%',
            }}>
            {/* App Name */}
            <Text style={styles.appNameText}>BeeSafe</Text>

            {/* Register/Sign in with Google */}
            <LinearGradient
              colors={['#F09819', '#F09819', '#EDDE5D']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                height: 50,
                width: '57.24%',
                borderRadius: 15,
              }}>
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  {borderRadius: 15, flexDirection: 'row'},
                ]}
                onPress={() => {
                  onGoogleButtonPress();
                }}>
                <Icon name="google" size={15} style={{marginRight: 5}} />
                <Text
                  style={{
                    fontFamily: 'Montserrat',
                    fontWeight: '600',
                    fontSize: 15,
                    lineHeight: 22,
                  }}>
                  Sign in with Google
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  appNameText: {
    fontSize: 40,
    lineHeight: 49,
    color: '#F0991A',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  loginButton: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});