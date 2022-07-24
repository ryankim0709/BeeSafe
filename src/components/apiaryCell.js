// UI imports
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Touchable,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ApiaryCell(props) {
  const uri = props.downloadurl;
  return (
    // Container
    <View style={styles.container}>
      <View style={styles.apiaryBox}>
        {/* Image box */}
        <TouchableOpacity
          style={styles.photoBox}
          onPress={() => {
            props.navigation.navigate('ApiaryBottomTabs', {
              name: props.name,
              latitude: props.latitude,
              longitude: props.longitude,
              notes: props.notes,
              downloadurl: props.downloadurl,
            });
          }}>
          {/* Image goes here*/}
          <Image source={{uri: uri}} style={styles.coverImage} />
        </TouchableOpacity>

        {/* Apiary information text container */}
        <View style={styles.textBox}>
          {/* Apiary information */}
          <View>
            <Text style={styles.infoText}>{props.name}</Text>
            <Text style={styles.infoText}>
              {props.latitude} {props.longitude}
            </Text>
          </View>
          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              const email = auth().currentUser.email;
              firestore()
                .collection('Users')
                .doc(email)
                .collection('Apiaries')
                .doc(props.name)
                .delete()
                .then(() => {
                  console.log('Apiary Deleted');
                });
            }}>
            <Feather name="trash-2" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    alignItems: 'center',
    width: '84.34579%',
    height: Dimensions.get('window').height * 0.25,
    borderRadius: 10,
  },
  // Apiary cell container
  apiaryBox: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    flexDirection: 'column',
  },
  // Apiary image container
  photoBox: {
    width: '100%',
    height: '77.8443%',
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
  },
  // Info text container
  textBox: {
    marginTop: '1%',
    marginLeft: '4.70914%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  // Info text
  infoText: {
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: 13,
  },
  // Cover image
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
