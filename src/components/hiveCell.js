// UI imports
import React, {useEffect} from 'react';
import {View, Text, Dimensions, StyleSheet, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function HiveCell(route) {
  const apiaryData = route['apiaryData'];
  const hiveData = route['hiveData'];
  const uri = hiveData['downloadurl'];

  useEffect(() => {});

  async function deleteHive() {
    firestore().collection('Hives').doc(hiveData.hiveId).delete();
  }

  return (
    <View style={styles.container}>
      {/* Hive cover image */}
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => {
            route.navigation.navigate('HiveBottomTabs', {
              hiveData: hiveData,
              apiaryData: apiaryData,
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
          <Text style={styles.infoText}>{hiveData['name']}</Text>
          <Text style={styles.infoText}>{hiveData['type']}</Text>
          <Text style={styles.infoText}>
            {hiveData['month']} {hiveData['day']}, {hiveData['year']}
          </Text>
        </View>
        <View style={styles.trashContainer}>
          <TouchableOpacity
            onPress={() => {
              deleteHive();
            }}>
            <Feather name="trash-2" size={25} />
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
    width: '17%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    width: '88%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  // Text style
  infoText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 21.94,
  },
});
