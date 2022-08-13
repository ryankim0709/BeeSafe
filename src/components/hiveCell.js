// UI imports
import React, {useEffect} from 'react';
import {View, Text, Dimensions, StyleSheet, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function HiveCell(route) {
  const uri = route['uri'];

  useEffect(() => {
    console.log(route);
  });

  async function deleteHive() {
    firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .collection('Apiaries')
      .doc(route['apiaryData']['name'])
      .collection('Hives')
      .doc(route['name'])
      .delete()
      .then(() => {
        console.log('Deletion complete');
      });
  }

  return (
    <View style={styles.container}>
      {/* Hive cover image */}
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => {
            route.navigation.navigate('HiveBottomTabs', {
              hiveName: route['hiveData']['name'],
              apiaryName: route['apiaryData']['name'],
              hiveData: route['hiveData'],
              apiarydata: route['apiaryData'],
            });
          }}>
          <Image
            style={{width: '100%', height: '100%', borderRadius: 10}}
            source={{uri: uri}}
          />
        </TouchableOpacity>
      </View>
      {/* Hive extra info */}
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.infoText}>{route['name']}</Text>
          <Text style={styles.infoText}>{route['type']}</Text>
          <Text style={styles.infoText}>
            {route['month']} {route['day']}, {route['year']}
          </Text>
        </View>
        <View style={styles.trashContainer}>
          <TouchableOpacity
            onPress={() => {
              deleteHive();
            }}>
            <Feather name="trash-2" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container
  container: {
    width: '100%',
    width: '100%',
    height: Dimensions.get('window').height * 0.11879,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  // Cover image container
  imageContainer: {
    width: '48.1308%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  // Extra info container
  infoContainer: {
    width: '38.785%',
    height: '100%',
    // justifyContent: 'center',
    flexDirection: 'row',
  },
  trashContainer: {
    width: '12%',
    height: '100%',
  },
  textContainer: {
    width: '88%',
    height: '100%',
  },
  // Text style
  infoText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 21.94,
  },
});
