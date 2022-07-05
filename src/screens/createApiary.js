import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Banner from '../components/banner';

export default function CreateApiary({navigation, route}) {
  return (
    <View style={styles.container}>
      {/* Banner Container */}
      <View style={styles.bannerContainer}>
        <Banner />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bannerContainer: {
    width: '78.9719%',
    height: '4.8596%',
    marginLeft: '6.542%%',
    marginTop: '6.6954%',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    alignSelf: 'flex-start',
  },
});
