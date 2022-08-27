// UI imports
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SearchBar} from 'react-native-elements';

// Auth imports
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Component imports
import ApiaryCell from '../../components/apiaryCell';

// Navigation imports
import {useFocusEffect} from '@react-navigation/native';

export default function Home({navigation}) {
  // Auth states
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  // Auth state change
  async function onAuthStateChanged(user) {
    if (!user) {
      navigation.navigate('Login');
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getData();

      return () => {
        setData();
      };
    }, []),
  );

  useEffect(() => {
    getData();

    // Auth state change
    const authChange = auth().onAuthStateChanged(onAuthStateChanged);

    // Create new user
    var creationTime = new Date(
      auth().currentUser.metadata.creationTime,
    ).getTime(); // User creation time
    var currTime = new Date().getTime(); // User last login

    if (currTime - creationTime <= 2000) {
      // last log in - current <= 2 seconds
      initUser();
    }

    // If the data changes, get the data again
    const dataListener = firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .collection('Apiaries')
      .onSnapshot(logData, onError);
    //getData();
    return () => {
      authChange;
      dataListener;
    }; // unsubscribe on unmount
  }, []);

  function onError(error) {
    console.error(error);
  }

  function logData(QuerySnapshot) {
    var dataTemp = [];
    QuerySnapshot.forEach(doc => {
      dataTemp.push(doc.data());
    });
    setData(dataTemp);
  }

  async function getData() {
    var dataTemp = [];
    // Getting data
    firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .collection('Apiaries')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          dataTemp.push(doc.data());
        });
      })
      .then(() => {
        setData(dataTemp);
      });
  }

  async function getQueryData(querry) {
    querry = querry.toLowerCase();
    dataTemp = [];
    firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .collection('Apiaries')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var name = doc.data()['name'].toLowerCase();
          if (name.includes(querry)) {
            dataTemp.push(doc.data());
          }
        });
      })
      .then(() => {
        setData(dataTemp);
      });
  }

  async function initUser() {
    // using auth().currentUser is faster than user.
    var displayname = auth().currentUser.displayName;
    var email = auth().currentUser.email;

    // Initialize new user with email and name
    firestore()
      .collection(`Users`)
      .doc(email)
      .set({
        email: email,
        name: displayname,
        sharing: false,
      })
      .then(() => {
      });
  }

  if (!data) return null;
  return (
    // Container
    <View style={styles.container}>
      {/* Seach Bar */}
      <SearchBar
        placeholder="Apiary Name"
        value={search}
        onChangeText={text => {
          setSearch(text);
          getQueryData(text);
        }}
        platform="ios"
        containerStyle={{
          width: '84.34579%',
          marginTop: '6.47%',
          backgroundColor: 'white',
          borderRadius: 5,
        }}
      />

      {/* Apiary header text */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Apiaries</Text>
      </View>

      {/* Apiary list */}
      <ScrollView
        style={{
          width: '100%',
          marginTop: '2.8077%',
          borderRadius: 10,
        }}>
        {data.map((data, key) => (
          <View style={styles.apiaryContainer} key={key}>
            <ApiaryCell
              name={data['name']}
              latitude={data['latitude']}
              longitude={data['longitude']}
              notes={data['notes']}
              downloadurl={data['downloadurl']}
              navigation={navigation}
              city={data['city']}
              country={data['country']}
            />
          </View>
        ))}
      </ScrollView>

      {/* View for padding at the bottom of ScrollView */}
      <View style={{width: '100%', height: '7.1923%', borderRadius: 10}}></View>
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
    width: '85.2893%',
    height: '4.3196%',
    marginTop: '6.47%',
    borderRadius: 40,
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
  },
  // Text in "Apiary" header
  headerText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    paddingTop: 10,
    fontSize: 25,
    lineHeight: 21.94,
  },
});
