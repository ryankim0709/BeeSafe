import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

export default function ApiaryCell() {
  return (
    <View style={styles.container}>
      <View style={styles.apiaryBox}>
        <View style={styles.photoBox}>{/* Image goes here*/}</View>

        {/* Apiary information text */}
        <View style={styles.textBox}>
          <Text style={styles.infoText}>Apiary Name</Text>
          <Text style={styles.infoText}>Apiary Location</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '84.34579%',
    height: Dimensions.get('window').height * 0.25,
    borderRadius: 10,
  },
  apiaryBox: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    flexDirection: 'column',
  },
  photoBox: {
    width: '92.79778%',
    height: '77.8443%',
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
  },
  textBox: {
    marginTop: '1%',
    marginLeft: '4.70914%',
  },
  infoText: {
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: 13,
  },
});
