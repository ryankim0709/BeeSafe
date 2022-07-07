import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import ApiaryCell from '../components/apiaryCell';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

export default function Home({navigation}) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  async function onAuthStateChanged(user) {
    await setUser(user);
    if (!user) {
      navigation.navigate('Login');
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    var creationTime = new Date(
      auth().currentUser.metadata.creationTime,
    ).getTime();
    var lastLogIn = new Date(
      auth().currentUser.metadata.lastSignInTime,
    ).getTime();

    if (lastLogIn - creationTime <= 2000) {
      initUser();
    }
    return subscriber; // unsubscribe on unmount
  }, []);

  async function initUser() {
    console.log('NEW USER');
    var displayname = auth().currentUser.displayName;
    var email = auth().currentUser.email;
    console.log(auth().currentUser);
    firestore()
      .collection(`Users`)
      .doc(email)
      .set({
        email: {email},
        name: {displayname},
      })
      .then(() => {
        console.log('User initialized!');
      });

    firestore()
      .collection('Users')
      .doc(email)
      .collection('Apiaries')
      .doc('init')
      .set({
        name: 'init',
      })
      .then(() => {
        console.log('Something?');
      });
  }

  if (initializing) return null;

  return (
    <View style={styles.container}>
      {/* Seach Bar */}
      <View style={styles.barContainer}>
        <Text>Search Bar should be here</Text>
      </View>

      {/* Apiary header */}
      <View
        style={{
          alignSelf: 'flex-start',
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          marginLeft: '5.14%',
          marginTop: '0.9719%',
        }}>
        <Text
          style={{
            fontFamily: 'Montserrat',
            fontWeight: '600',
            fontSize: 18,
            lineHeight: 21.94,
          }}>
          Apiaries
        </Text>
      </View>

      {/* Apiary list */}
      {/* Use ScrollView for just the Apiaries or the whole screen? */}

      <View style={styles.apiaryContainer}>
        <ApiaryCell />
      </View>

      <TouchableOpacity
        style={{width: 100, height: 100, alignSelf: 'center', marginTop: 100}}
        onPress={async () => {
          auth().signOut();
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        }}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  barContainer: {
    borderWidth: 1,
    width: '85.2893%',
    height: '4.3196%',
    marginTop: '6.47%',
  },
  apiaryContainer: {
    width: '100%',
    marginTop: '2.8077%',
    alignItems: 'center',
  },
});
