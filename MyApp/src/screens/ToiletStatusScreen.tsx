import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ToiletAPI } from '../api/toilet';

const ToiletStatusScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const gender = route.params.gender;
  const bathroomId = route.params.id;
  const floor = route.params.floor;
  console.log(floor, navigation, gender);
  const [ToiletList, setToiletList] = useState<any[]>([]);

  const bathRoomStatus: Record<string, string> = {
    vacant: '비었음',
    occupied: '사용중',
    broken: '고장',
  };

  useEffect(() => {
    async function test() {
      const result = await ToiletAPI.fetchStallsByBathroomId(bathroomId);
      console.log('🎉 테스트 결과:', result);
      setToiletList(result);
    }
    test();
  }, [bathroomId]);

  return (
    <View>
      <Text>화장실을 선택해주세요</Text>
      <ScrollView>
        {ToiletList.map((Item, index) => {
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
                칸 {bathRoomStatus[Item.status]}
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
