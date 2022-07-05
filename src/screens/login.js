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

          {/* App Name */}
          <View
            style={{
              alignItems: 'center',
              marginTop: '10%',
              width: '70.09%',
              alignSelf: 'center',
              height: '15.33%',
            }}>
            <Text style={styles.appNameText}>BeeSafe</Text>
          </View>

          {/* Text Input*/}
          <TextInput
            style={[styles.input, {marginTop: '0.00863%', paddingLeft: 5}]}
            placeholder="ID"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            onChangeText={text => {
              setEmail(text);
            }}
          />
          <TextInput
            style={[styles.input, {marginTop: '1.1187%', paddingLeft: 5}]}
            placeholder="PASSWORD"
            autoCapitalize="none"
            secureTextEntry
            onChangeText={text => {
              setPassword(text);
            }}
          />
          <Text style={{alignSelf: 'center', color: 'red'}}>{error}</Text>

          {/* Login + Register Button */}
          <View
            style={{
              width: '57.24%',
              height: '4.859%',
              flexDirection: 'row',
              alignSelf: 'center',
              justifyContent: 'space-evenly',
              marginTop: '2%',
            }}>
            <LinearGradient
              colors={['#F09819', '#F09819', '#EDDE5D']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{borderRadius: 15, width: '40%'}}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => {
                  signIn();
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat',
                    fontWeight: '600',
                    fontSize: 18,
                    lineHeight: 22,
                  }}>
                  Login
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
              colors={['#F09819', '#F09819', '#EDDE5D']}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={{borderRadius: 15, width: '50%'}}>
              <TouchableOpacity style={styles.loginButton}>
                <Text
                  style={{
                    fontFamily: 'Montserrat',
                    fontWeight: '600',
                    fontSize: 18,
                    lineHeight: 22,
                  }}>
                  Register
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* OR divider */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: '2%',
            }}>
            <View style={{height: 1, backgroundColor: 'grey', width: 100}} />
            <View>
              <Text
                style={{
                  width: 50,
                  textAlign: 'center',
                  color: 'grey',
                  fontFamily: 'Montserrat',
                }}>
                Or
              </Text>
            </View>
            <View style={{height: 1, backgroundColor: 'grey', width: 100}} />
          </View>

          {/* Register/Sign in with Google */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              height: 50,
              width: '57.24%',
              marginTop: '2%',
            }}>
            <LinearGradient
              colors={['#F09819', '#F09819', '#EDDE5D']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{width: '100%', height: '100%', borderRadius: 15}}>
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
  },
  input: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '54%',
    height: '4.2116%',
    borderWidth: 1,
    borderColor: '#F09819',
    borderRadius: 10,
  },
  loginButton: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
