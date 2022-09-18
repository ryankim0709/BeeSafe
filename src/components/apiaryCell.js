// UI imports
import React, {useEffect} from 'react';
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
  const data = props.data;
  useEffect(() => {}, []);
  async function deleteApiary() {
    var ref = firestore()
      .collection('Apiaries')
      .where('name', '==', data.name)
      .where('apiaryId', '==', data.apiaryId);

    var apiaryId;
    (await ref.get()).forEach(data => {
      apiaryId = data.id;
    });

    firestore().collection('Apiaries').doc(apiaryId).delete();
  }
  const uri = data.downloadurl;
  return (
    // Container
    <View style={styles.container}>
      <View style={styles.apiaryBox}>
        {/* Image box */}
        <TouchableOpacity
          style={styles.photoBox}
          onPress={() => {
            props.navigation.navigate('ApiaryBottomTabs', {
              data: data,
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
            <Text style={styles.infoText}>{data['name']}, </Text>
            {data['city'] === '' && (
              <Text style={styles.infoText}>
                {data['latitude']} {data['longitude']}
              </Text>
            )}
            {data['city'] !== '' && (
              <Text style={styles.infoText}>
                {data['city']} {data['country']}
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
