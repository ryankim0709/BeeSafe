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

export default function Home({navigation}) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (!user) {
      navigation.navigate('Login');
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

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
