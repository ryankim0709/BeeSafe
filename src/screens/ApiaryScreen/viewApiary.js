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
import Banner from '../../components/banner';
import HiveCell from '../../components/hiveCell';

// Auth imports
import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';

// Navigation imports
import {useFocusEffect} from '@react-navigation/native';

export default function ViewApiary({route, navigation}) {
  const apiaryData = route.data;
  const uri = apiaryData['downloadurl']; // Cover image uri
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
    // Auth state change
    const authChange = auth().onAuthStateChanged(onAuthStateChanged);
    // If the data changes, get the data again
    const dataListener = firestore()
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
    var uid = auth().currentUser.uid;
    var apiaryId = route.data.apiaryId;
    QuerySnapshot.forEach(doc => {
      var data = doc.data();
      if (data.user === uid && data.apiaryId === apiaryId) {
        dataTemp.push(data);
      }
    });
    setData(dataTemp);
  }

  async function getData() {
    firestore()
      .collection('Hives')
      .get()
      .then(res => {
        logData(res);
      });
  }

  if (!data) return null;
  return (
    <View style={styles.container}>
      {/* Banner */}
      <Banner text="Apiary" />

      {/* Cover image */}
      <View style={styles.apiaryImageContainer}>
        <Image source={{uri: uri}} style={styles.apiaryImage} />
      </View>

      {/* Apiary Name */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{apiaryData['name']}</Text>
      </View>

      {/* Apiary Coordinates */}
      <View style={styles.infoContainer}>
        {apiaryData['city'] === '' && (
          <Text style={styles.infoText}>
            {apiaryData['latitude']} {apiaryData['longitude']}
          </Text>
        )}
        {apiaryData['city'] !== '' && (
          <Text style={styles.infoText}>
            {apiaryData['city']} {apiaryData['country']}
          </Text>
        )}
      </View>

      {/* Hive list */}
      <ScrollView style={styles.hiveContainer}>
        {data.map((data, key) => (
          <View style={styles.hiveCellContainer} key={key}>
            <HiveCell
              navigation={navigation}
              hiveData={data}
              apiaryData={apiaryData}
            />
          </View>
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
    color: '#5a5a5a',
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
