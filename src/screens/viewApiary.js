import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Banner from '../components/banner';
import HiveCell from '../components/hiveCell';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';

export default function ViewApiary({route, navigation}) {
  const uri = route['downloadurl'];
  const [data, setData] = useState([]);
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);

  async function onAuthStateChanged(user) {
    await setUser(user);
    if (!user) {
      navigation.navigate('Login');
    }
    if (initializing) setInitializing(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      getData();

      return () => {
        console.log('Unfocused. Clean up here');
        setData([]);
      };
    }, []),
  );

  useEffect(() => {
    // Auth state change
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    getData();
    return subscriber; // unsubscribe on unmount
  }, []);

  async function getData() {
    var dataTemp = [];
    const userEmail = auth().currentUser.email;
    const apiaryName = route['name'];
    console.log(apiaryName);
    firestore()
      .collection('Users')
      .doc(userEmail)
      .collection('Apiaries')
      .doc(apiaryName)
      .collection('Hives')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          dataTemp.push(doc.data());
        });
      })
      .then(() => {
        console.log(dataTemp);
        setData(dataTemp);
      });
  }
  if (initializing || !data) return null;
  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Banner text="Apiary" />
      </View>

      <View style={styles.apiaryImageContainer}>
        <Image source={{uri: uri}} style={styles.apiaryImage} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{route['name']}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {route['latitude']} {route['longitude']}
        </Text>
      </View>

      <ScrollView style={styles.hiveContainer}>
        {data.map((data, key) => (
          <TouchableOpacity
            style={styles.hiveCellContainer}
            key={key}
            onPress={() => {
              console.log(route);
              var name = route['name'];
              navigation.navigate('HiveCheck', {
                hiveName: data['name'],
                apirayName: name,
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

      <View style={{width: '100%', height: '7.1923%', borderRadius: 10}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },
  bannerContainer: {
    width: '78.9719%',
    height: '4.8596%',
    marginLeft: '6.542%',
    marginTop: '6.6954%',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    alignSelf: 'flex-start',
  },
  apiaryImageContainer: {
    backgroundColor: '#F5F5F5',
    width: '86.916%',
    height: '18.034%',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginTop: '2.2678%',
    borderRadius: 15,
  },
  apiaryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  infoContainer: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '1.51187%',
  },
  infoText: {
    color: '#686A68',
    fontFamily: 'Montserrat',
    fontWeight: 'normal',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 17,
  },
  hiveContainer: {
    width: '100%',
    marginTop: '2.8077%',
    height: '10%',
    borderRadius: 10,
  },
  hiveCellContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: '2.8077%',
  },
});
