import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, Linking, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNLocation from 'react-native-location';

RNLocation.configure({
  distanceFilter: 0,
  desiredAccuracy: {
    ios: 'best',
    android: 'balancedPowerAccuracy',
  },
});

export default function WorldView() {
  const [lat, setLat] = useState(0);
  const [lon, setLong] = useState(0);
  const [init, setInit] = useState(false);
  const [hiveData, setHiveData] = useState();

  useEffect(() => {
    firestore()
      .collection('Users')
      .get()
      .then(res => {
        res.forEach(user => {
          console.log(user.data());
        });
      })
      .then(() => {
        getCurrLocation().then(() => {
          getData().then(() => {
            console.log(hiveData);
            setInit(true);
          });
        });
      });
  }, []);

  async function getData() {
    firestore()
      .collection('Users')
      .get()
      .then(res => {
        console.log(res.docs);
        res.forEach(user => {
          var data = user.data();
          if (data['sharing']) {
            getApiaries(data['email']);
          }
        });
      });
  }

  async function getApiaries(user) {
    firestore()
      .collection('Users')
      .doc(user)
      .collection('Apiaries')
      .get()
      .then(res => {
        res.forEach(apiary => {
          getHiveData(user, apiary.data()['name']);
        });
      });
  }

  async function getHiveData(user, apiaryName) {
    data = hiveData;
    if (!hiveData) data = [];

    firestore()
      .collection('Users')
      .doc(user)
      .collection('Apiaries')
      .doc(apiaryName)
      .collection('Hives')
      .get()
      .then(res => {
        res.forEach(hive => {
          var hive = hive.data();
          var img =
            hive['affected'] == 'true'
              ? require('../assets/img/varroa.png')
              : require('../assets/img/download.jpg');
          var markerData = {
            name: hive['name'],
            affected: hive['affected'],
            coords: {
              latitude: hive['latitude'],
              longitude: hive['longitude'],
            },
            img: img,
          };
          data.push(markerData);
        });
      })
      .then(() => {
        setHiveData(data);
      });
  }

  async function getCurrLocation() {
    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse', // or 'fine'
      },
    });

    let location;
    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'coarse',
          rationale: {
            title: 'We need to access your location',
            message: 'We use your location to show where you are on the map',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        },
      });
    }
    if (permission == false) {
      Alert.alert(
        'Location Permissions',
        'Please allow location permissions for automatic latitude/longitude',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'OK', onPress: () => Linking.openSettings()},
        ],
      );
    } else {
      location = await RNLocation.getLatestLocation({timeout: 100});
      var lat = parseFloat(location['latitude']).toFixed(4).toString();
      var lon = parseFloat(location['longitude']).toFixed(4).toString();
      setLat(lat);
      setLong(lon);
    }
  }

  if (!init || !hiveData) return null;

  const region = {
    latitude: lat,
    longitude: lon,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  return (
    <View style={styles.container}>
      <MapView
        initialRegion={region}
        style={{flex: 1, width: '100%', height: '100%'}}
        ref={ref => {
          this.map = ref;
        }}>
        {hiveData.map((hive, index) => {
          console.log('HIVE');
          console.log(hive);
          return (
            <Marker
              key={index}
              coordinate={hive['coords']}
              title={hive['name']}
              description={hive['affected']}>
              <Image
                source={hive['img']}
                style={{width: 40, height: 40}}
                resizeMode="contain"
              />
            </Marker>
          );
        })}
      </MapView>
      <View
        style={{
          position: 'absolute', //use absolute position to show button on top of the map
          top: '50%', //for center align
          alignSelf: 'flex-end', //for align to right
        }}>
        <TouchableOpacity
          onPress={() => {
            this.map.animateToRegion(region);
          }}>
          <Text>Testing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
