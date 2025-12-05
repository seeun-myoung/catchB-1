import {  View, Text,  ScrollView } from 'react-native'
import React from 'react'
import { useRoute, useNavigation } from '@react-navigation/native';

const ToiletStatusScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const gender = route.params.gender;
  const floor = route.params.floor;
  console.log(floor,navigation,gender)

  // const toiletCounts ={
  //   male: {
  //     urinal:4,
  //     toilet:3
  //   },
  //   female: {
  //     toilet:6
  //   }
  // }
  const isMale = gender === 'male';
  
  return (
    <View>
      <Text>화장실을 선택해주세요</Text>
      <ScrollView>
        {isMale}
      </ScrollView>
    </View>
  )
}

//const styles  = StyleSheet.create({})
export default ToiletStatusScreen