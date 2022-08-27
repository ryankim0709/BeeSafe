// UI imports
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ApiaryCell(props) {
  async function deleteApiary() {
    firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .collection('Apiaries')
      .doc(props.name)
      .delete()
      .then(() => {});
  }
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
              city: props.city,
              country: props.country,
            });
          }}>
          {/* Image goes here*/}
          <Image source={{uri: uri}} style={styles.coverImage} />
        </TouchableOpacity>

        {/* Apiary information text container */}
        <View style={styles.textBox}>
          {/* Apiary information */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Text style={styles.infoText}>{props.name}, </Text>
            {props.city === '' && (
              <Text style={styles.infoText}>
                {props.latitude} {props.longitude}
              </Text>
            )}
            {props.city !== '' && (
              <Text style={styles.infoText}>
                {props.city} {props.country}
              </Text>
            )}
          </View>
          {/* Apiary Deletion */}
          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              deleteApiary();
            }}>
            {/* Trash bin icon */}
            <Feather name="trash-2" size={25} />
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
    marginTop: '2%',
    marginLeft: '4.70914%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    display: 'flex',
  },
  // Info text
  infoText: {
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: 20,
    alignSelf: 'center',
  },
  // Cover image
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
