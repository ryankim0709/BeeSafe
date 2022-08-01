// UI imports
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// Component imports
import Banner from '../components/banner';
import HiveCell from '../components/hiveCell';

// Auth imports
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Navigation imports
import {useFocusEffect} from '@react-navigation/native';

export default function ViewApiary({route, navigation}) {
  const uri = route['downloadurl']; // Cover image uri
  const [data, setData] = useState([]); // Apiary image

  async function onAuthStateChanged(user) {
    if (!user) {
      navigation.navigate('Login');
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getData();
      return () => {
        setData([]);
      };
    }, []),
  );

  useEffect(() => {
    // Get initial data
    getData();

    // Auth state change
    const authChange = auth().onAuthStateChanged(onAuthStateChanged);
    // If the data changes, get the data again
    const dataListener = firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .collection('Apiaries')
      .doc(route['name'])
      .collection('Hives')
      .onSnapshot(logData, onError);

    return () => {
      authChange;
      dataListener;
    };
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
    firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .collection('Apiaries')
      .doc(route['name'])
      .collection('Hives')
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

  if (!data) return null;
  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Banner text="Apiary" />
      </View>

      {/* Cover image */}
      <View style={styles.apiaryImageContainer}>
        <Image source={{uri: uri}} style={styles.apiaryImage} />
      </View>

      {/* Apiary Name */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{route['name']}</Text>
      </View>

      {/* Apiary Coordinates */}
      <View style={styles.infoContainer}>
        {route['city'] === '' && (
          <Text style={styles.infoText}>
            {route['latitude']} {route['longitude']}
          </Text>
        )}
        {route['city'] !== '' && (
          <Text style={styles.infoText}>
            {route['city']} {route['country']}
          </Text>
        )}
      </View>

      {/* Hive list */}
      <ScrollView style={styles.hiveContainer}>
        {data.map((data, key) => (
          <TouchableOpacity
            style={styles.hiveCellContainer}
            key={key}
            onPress={() => {
              {
                /* Navigate to hive check on press */
              }
              var apiaryName = route['name'];
              navigation.navigate('HiveCheck', {
                hiveName: data['name'],
                apirayName: apiaryName,
              });
            }}>
            <HiveCell
              name={data['name']}
              uri={data['downloadurl']}
              month={data['month']}
              day={data['day']}
              year={data['year']}
              type={data['type']}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ScrollView Padding */}
      <View style={{width: '100%', height: '7.1923%', borderRadius: 10}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },
  // Banner Container
  bannerContainer: {
    width: '78.9719%',
    height: '4.8596%',
    marginLeft: '6.542%',
    marginTop: '6.6954%',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    alignSelf: 'flex-start',
  },
  // Apiary cover image container
  apiaryImageContainer: {
    backgroundColor: '#F5F5F5',
    width: '86.916%',
    height: '18.034%',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginTop: '2.2678%',
    borderRadius: 15,
  },
  // Apiary cover image
  apiaryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  // Container for name / latitude & longitude
  infoContainer: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '1.51187%',
  },
  // Information text
  infoText: {
    color: '#686A68',
    fontFamily: 'Montserrat',
    fontWeight: 'normal',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 17,
  },
  // Hive container
  hiveContainer: {
    width: '100%',
    marginTop: '2.8077%',
    height: '10%',
    borderRadius: 10,
  },
  // Each hive cell
  hiveCellContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: '2.8077%',
  },
});
