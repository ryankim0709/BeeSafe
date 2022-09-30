import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Banner from '../../components/banner';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import HiveReportAccordian from '../../components/hiveReportAccordian';
import {ScrollView} from 'react-native-gesture-handler';

export default function HiveReport({route}) {
  const hiveId = route.hiveData.hiveId;
  const [data, setData] = useState([]);
  useEffect(() => {
    getData();

    const dataListener = firestore()
      .collection('Hives')
      .doc(hiveId)
      .onSnapshot(getData, onError);

    return () => {
      dataListener;
    };
  }, []);
  function onError(error) {
    console.error(error);
  }

  async function getData() {
    firestore()
      .collection('Hives')
      .doc(hiveId)
      .get()
      .then(res => {
        const checks = res.data().checks;
        setData(checks);
      });
  }
  return (
    <View style={styles.container}>
      <Banner text="Hive Report" />

      <ScrollView>
        {data.map((data, key) => (
          <HiveReportAccordian key={key} data={data} />
        ))}
      </ScrollView>
      <View
        style={{
          width: '100%',
          height: '7.1923%',
          borderRadius: 10,
        }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
