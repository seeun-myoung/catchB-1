// 🔥 React import
// 리액트는 화면을 "컴포넌트" 단위로 만드는 라이브러리라 항상 불러와야 함
import React, { useEffect, useState } from 'react';

// 🔥 React Native UI 컴포넌트들
// View: 레이아웃 박스
// Text: 글자
// Button: 기본 버튼
// StyleSheet: 스타일을 JS 객체로 깔끔하게 관리하도록 도와주는 도구
import { View, Text, Button, StyleSheet } from 'react-native';

// 🔥 React Navigation 훅
// useNavigation: 다른 화면으로 이동(navigate)하기 위한 함수들을 제공해주는 훅
import { useNavigation } from '@react-navigation/native';
import { ToiletAPI } from '../api/toilet';

// 🔥 층 선택 화면 컴포넌트
// 화살표 함수 + const 로 컴포넌트 선언 (요즘 가장 많이 쓰는 패턴)
const FloorSelectScreen = () => {
  // navigation 객체 가져오기
  // any: 타입스크립트 복잡한 타입 신경 안 쓰고 편하게 쓰기 위한 설정 (입문 단계에 좋음)
  const navigation = useNavigation<any>();
  const [floors, setFloors] = useState<any[]>([]);

  useEffect(() => {
    async function test() {
      const result = await ToiletAPI.fetchFloor();
      console.log('🎉 테스트 결과:', result);
      setFloors(result);
    }
    test();
  }, []);

  console.log('????', floors);
  // 🔥 층 선택 시 실행할 함수
  // floor 파라미터로 8 또는 9를 받아서, 다음 화면으로 전달해줌
  const handleSelectFloor = (floor: number, id: string) => {
    console.log(`✅ ${floor}층 선택됨`);

    // 🔥 ToiletSelect 화면으로 이동
    // 'ToiletSelect'는 App.tsx의 Stack.Screen name과 동일해야 함
    // 두 번째 인자 { floor } 는 "화면에 함께 전달할 데이터"
    navigation.navigate('ToiletSelect', { floor, id });
  };

  return (
    <View style={styles.container}>
      {/* 화면 제목 */}
      <Text style={styles.title}>층을 선택하세요</Text>

      {/* 버튼 영역 */}
      <View style={styles.buttonGroup}>
        {floors.map(f => (
          <Button
            key={f.id}
            title={f.name}
            onPress={() => handleSelectFloor(f.floor_number, f.id)}
          />
        ))}
      </View>
    </View>
  );
};

// 🔥 StyleSheet로 스타일 정의
// CSS가 아니라 JS 객체 형태로 스타일을 관리
const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체 차지
    justifyContent: 'center', // 세로 가운데 정렬
    alignItems: 'center', // 가로 가운데 정렬
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
  },
  buttonGroup: {
    width: '60%',
    gap: 12, // RN 0.71+에서 지원, 버튼 사이 간격
  },
});

// 🔥 이 컴포넌트를 기본(export default)으로 내보내기
// App.tsx 에서 import FloorSelectScreen ... 으로 불러다 씀
export default FloorSelectScreen;
