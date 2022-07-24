import React from 'react';
import {View, Text, Dimensions, StyleSheet, Image} from 'react-native';

export default function HiveCell(props) {
  const uri = props.uri;
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={{width: '100%', height: '100%', borderRadius: 10}}
          source={{uri: uri}}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{props.name}</Text>
        <Text style={styles.infoText}>{props.type}</Text>
        <Text style={styles.infoText}>
          {props.month} {props.day}, {props.year}
        </Text>
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
