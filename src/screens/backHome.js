import React, {useEffect} from 'react';

export default function BackHome({navigation}) {
  useEffect(() => {
    navigation.navigate('HomeBottomTabs');
  }, []);
  return null;
}
