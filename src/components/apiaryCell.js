// UI imports
import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';

export default function ApiaryCell(props) {
  const uri = props.downloadurl;
  return (
    // Container
    <View style={styles.container}>
      <View style={styles.apiaryBox}>
        {/* Image box */}
        <View style={styles.photoBox}>
          {/* Image goes here*/}
          <Image source={{uri: uri}} style={styles.coverImage} />
        </View>

        {/* Apiary information text container */}
        <View style={styles.textBox}>
          {/* Apiary information */}
          <Text style={styles.infoText}>{props.name}</Text>
          <Text style={styles.infoText}>
            {props.latitude} {props.longitude}
          </Text>
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
    width: '92.79778%',
    height: '77.8443%',
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
  },
  // Info text container
  textBox: {
    marginTop: '1%',
    marginLeft: '4.70914%',
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
