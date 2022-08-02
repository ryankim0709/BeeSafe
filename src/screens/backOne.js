import React, {useEffect} from 'react';

export default function BackOne({navigation}) {
  useEffect(() => {
    // Navigate back home
    navigation.goBack();
  }, []);
  return null;
}
