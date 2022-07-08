// UI imports
import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';

export default function ApiaryCell() {
  return (
    // Container
    <View style={styles.container}>
      <View style={styles.apiaryBox}>
        {/* Image box */}
        <View style={styles.photoBox}>{/* Image goes here*/}</View>

        {/* Apiary information text container */}
        <View style={styles.textBox}>
          {/* Apiary information */}
          <Text style={styles.infoText}>Apiary Name</Text>
          <Text style={styles.infoText}>Apiary Location</Text>
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
});
