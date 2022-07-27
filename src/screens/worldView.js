import React, {useState} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import RNLocation from 'react-native-location';

RNLocation.configure({
  distanceFilter: 0,
  desiredAccuracy: {
    ios: 'best',
    android: 'balancedPowerAccuracy',
  },
});

export default function WorldView() {
  [viewLocation, isViewLocation] = useState([]);

  const getLocation = async () => {
    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse', // or 'fine'
      },
    });

    console.log(permission);

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

      // location = await RNLocation.getLatestLocation({timeout: 100});
      // console.log(location);
      // isViewLocation(location);
    } else {
      location = await RNLocation.getLatestLocation({timeout: 100});
      console.log(location);
      isViewLocation(location);
    }
  };

  return (
    <View style={styles.container}>
      <Text>React Native Geolocation</Text>
      <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="Get Location" onPress={getLocation} />
      </View>
      <Text>Latitude: {viewLocation.latitude} </Text>
      <Text>Longitude: {viewLocation.longitude} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
