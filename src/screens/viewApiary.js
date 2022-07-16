import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Banner from '../components/banner';
import HiveCell from '../components/hiveCell';

export default function ViewApiary(props) {
  const uri = props['data']['downloadurl'];
  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Banner text="Apiary" />
      </View>

      <View style={styles.apiaryImageContainer}>
        <Image source={{uri: uri}} style={styles.apiaryImage} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{props['data']['name']}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {props['data']['latitude']} {props['data']['longitude']}
        </Text>
      </View>

      <ScrollView style={styles.hiveContainer}>
        <TouchableOpacity style={styles.hiveCellContainer}>
          <HiveCell />
        </TouchableOpacity>

        <TouchableOpacity style={styles.hiveCellContainer}>
          <HiveCell />
        </TouchableOpacity>

        <TouchableOpacity style={styles.hiveCellContainer}>
          <HiveCell />
        </TouchableOpacity>

        <TouchableOpacity style={styles.hiveCellContainer}>
          <HiveCell />
        </TouchableOpacity>

        <TouchableOpacity style={styles.hiveCellContainer}>
          <HiveCell />
        </TouchableOpacity>
      </ScrollView>

      <View style={{width: '100%', height: '7.1923%', borderRadius: 10}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },
  bannerContainer: {
    width: '78.9719%',
    height: '4.8596%',
    marginLeft: '6.542%',
    marginTop: '6.6954%',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    alignSelf: 'flex-start',
  },
  apiaryImageContainer: {
    backgroundColor: '#F5F5F5',
    width: '86.916%',
    height: '18.034%',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginTop: '2.2678%',
    borderRadius: 15,
  },
  apiaryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  infoContainer: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '1.51187%',
  },
  infoText: {
    color: '#686A68',
    fontFamily: 'Montserrat',
    fontWeight: 'normal',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 17,
  },
  hiveContainer: {
    width: '100%',
    marginTop: '2.8077%',
    height: '10%',
    borderRadius: 10,
  },
  hiveCellContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: '2.8077%',
  },
});
