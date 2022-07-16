import React from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';

export default function HiveCell() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}></View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Hive 1</Text>
        <Text style={styles.infoText}>Last Checked</Text>
        <Text style={styles.infoText}>July 1, 2021</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    width: '100%',
    height: Dimensions.get('window').height * 0.11879,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  imageContainer: {
    width: '48.1308%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  infoContainer: {
    width: '38.785%',
    height: '100%',
    justifyContent: 'center',
  },
  infoText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 21.94,
  },
});
