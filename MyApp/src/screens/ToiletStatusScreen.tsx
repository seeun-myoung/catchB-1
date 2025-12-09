import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

const ToiletStatusScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const gender = route.params.gender;
  const floor = route.params.floor;
  console.log(floor, navigation, gender);

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

  let toiletItems = [];

  if (isMale) {
    for (let i = 0; i < 4; i++) {
      toiletItems.push({ type: 'urinal' });
    }
    for (let i = 0; i < 3; i++) {
      toiletItems.push({ type: 'toilet' });
    }
  } else {
    for (let i = 0; i < 6; i++) {
      toiletItems.push({ type: 'toilet' });
    }
  }
  return (
    <View>
      <Text>화장실을 선택해주세요</Text>
      <ScrollView>
        {toiletItems.map((Item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{
                padding: 20,
                backgroundColor: '#eee',
                marginBottom: 10,
                borderRadius: 8,
              }}
              onPress={() => {
                console.log(`${index + 1}번 ${Item}칸 선택`, Item);
              }}
            >
              <Text
                style={{
                  color: '#000',
                }}
              >
                {index + 1}번 칸 {Item.type === 'urinal' ? '소변기' : '좌변기'}
                칸
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

//const styles  = StyleSheet.create({})
export default ToiletStatusScreen;
