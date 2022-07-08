// UI imports
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

// Auth imports
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

// Component imports
import ApiaryCell from '../components/apiaryCell';

export default function Home({navigation}) {
  // Auth states
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Auth state change
  async function onAuthStateChanged(user) {
    await setUser(user);
    if (!user) {
      navigation.navigate('Login');
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // Auth state change
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    // Create new user
    var creationTime = new Date(
      auth().currentUser.metadata.creationTime,
    ).getTime(); // User creation time
    var lastLogIn = new Date(
      auth().currentUser.metadata.lastSignInTime,
    ).getTime(); // user last login

    if (lastLogIn - creationTime <= 2000) {
      // last log in - current <= 2 seconds
      initUser();
    }
    return subscriber; // unsubscribe on unmount
  }, []);

  async function initUser() {
    console.log('NEW USER');
    // using auth().currentUser is faster than user.
    var displayname = auth().currentUser.displayName;
    var email = auth().currentUser.email;

    // console.log(auth().currentUser);

    // Initialize new user with email and name
    firestore()
      .collection(`Users`)
      .doc(email)
      .set({
        email: {email},
        name: {displayname},
      })
      .then(() => {
        console.log('User basics initialized!');
      });
  }

  if (initializing) return null;

  return (
    // Container
    <View style={styles.container}>
      {/* Seach Bar */}
      <View style={styles.barContainer}>
        <Text>Search Bar should be here</Text>
      </View>

      {/* Apiary header text */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Apiaries</Text>
      </View>

      {/* Apiary list */}
      {/* Use ScrollView for just the Apiaries or the whole screen? */}

      <View style={styles.apiaryContainer}>
        <ApiaryCell />
      </View>

      {/* Random logout button for testing */}
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
  // Container
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  // Search bar container
  barContainer: {
    borderWidth: 1,
    width: '85.2893%',
    height: '4.3196%',
    marginTop: '6.47%',
  },
  // Apiary list container
  apiaryContainer: {
    width: '100%',
    marginTop: '2.8077%',
    alignItems: 'center',
  },
  // "Apiary" text header container
  headerContainer: {
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    marginLeft: '5.14%',
    marginTop: '0.9719%',
  },
  // Text in "Apiary" header
  headerText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 21.94,
  },
});
