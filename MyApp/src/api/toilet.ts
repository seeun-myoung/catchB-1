// src/api/toilet.ts
//  !! 이 파일의 역할
// - Supabase와 직접 통신하는 "API 도구 상자"
// - 화면(컴포넌트, hooks)은 이 파일만 사용해서 DB 데이터를 가져오거나 수정함
//
// 지금은 3개 테이블(floors, bathrooms, stalls)만 먼저 다룰 거야. :contentReference[oaicite:0]{index=0}
//
// floors      : 8층 / 9층 정보
// bathrooms   : 각 층의 남/여 화장실 (floor_id + gender)
// stalls      : 실제 칸(좌변기/소변기) 정보

import { supabase } from '../lib/supabase';

export interface Floor {
  id: string;
  floor_number: number;
  name: string | null;
}

export interface Bathroom {
  id: string; // 각 화장실의 고유 ID (UUID)
  floor_id: string; // 층 정보 (8, 9 등)
  gender: 'male' | 'female'; // 남/여
  name: string; // 칸 이름
}

export type StallStatus = 'vacant' | 'occupied' | 'broken';

export interface Stall {
  id: string; // 각 칸의 고유 ID (UUID)
  bathroom_id: string; // 층 정보 (8, 9 등)
  bathroom_name: string; // b8f, b8m, b9f ,b9m
  stall_number: number; // 1,2,3 ... (몇 번째 칸인지)
  type: 'toilet' | 'urinal'; // 좌변기 / 소변기 구분
  status: StallStatus; // 현재 상태: 빈칸/사용중/고장
  created_at: string; // 생성 시각 (문자열로 받음)
  // 칸 이름
}

// 화면에서 사용할 성별 타입 (React 컴포넌트와 맞춰주기용)
export type Gender = 'male' | 'female';

//
// 2. export const ToiletAPI = { ... } 가 뭐냐?
//
// - "ToiletAPI" 라는 이름의 객체(object)를 하나 만들고
// - 그 안에 여러 개의 함수(fetchFloors, fetchBathroomsByFloor, fetchStalls...)를 넣어둔 것.
// - 앞에 export 를 붙여서 "다른 파일에서 가져다 쓸 수 있게" 공개하는 것.
//
// 사용 예시:
//   import { ToiletAPI } from '../api/toilet';
//
//   const floors = await ToiletAPI.fetchFloors();
//
// 이런 식으로 쓰려고 묶어놓은 거야.
//
//
// 2. export const ToiletAPI = { ... } 가 뭐냐?
//
// - "ToiletAPI" 라는 이름의 객체(object)를 하나 만들고
// - 그 안에 여러 개의 함수(fetchFloors, fetchBathroomsByFloor, fetchStalls...)를 넣어둔 것.
// - 앞에 export 를 붙여서 "다른 파일에서 가져다 쓸 수 있게" 공개하는 것.
//
// 사용 예시:
//   import { ToiletAPI } from '../api/toilet';
//
//   const floors = await ToiletAPI.fetchFloors();
//
// 이런 식으로 쓰려고 묶어놓은 거야.
//

export const ToiletAPI = {
  //
  // 2-1. 모든 층 목록 가져오기 (floors 전체)
  //
  // - 나중에 "층 선택 화면"에서 사용 예정
  // - 지금은 8층, 9층만 들어있을 것
  //
  async fetchFloor(): Promise<Floor[]> {
    const { data, error } = await supabase
      .from('floors')
      .select('id, floor_number, name')
      .order('floor_number', { ascending: true });

    if (error) {
      console.log('층목록 못가져옴', error);
      throw error;
    }

    return (data ?? []) as Floor[];
  },

  //
  // 2-2. 특정 층의 남/여 화장실 목록 가져오기
  //
  // - React 쪽에서는 "floorNumber(8/9) + gender(male/female)"만 알고 있음
  // - DB 구조는 아래처럼 2단계라서:
  //     floors (층)  →  bathrooms (층별 남/여 화장실)
  //   1) 우선 floors에서 floor_number로 해당 층을 찾고
  //   2) 그 층의 id를 이용해서 bathrooms를 조회해야 함 :contentReference[oaicite:2]{index=2}
  //
  async fetchBathroomByFloor(floor_id: string): Promise<Bathroom[]> {
    const { data, error } = await supabase
      .from('bathrooms')
      .select('id,floor_id,gender, name');

    if (error) {
      console.log('화장실 조회 실패', error);
      throw error;
    }
    let bathrooms: Bathroom[] = [];

    data?.forEach(bathroom => {
      if (bathroom.floor_id === floor_id) {
        bathrooms.push(bathroom);
      }
    });

    return (bathrooms ?? []) as Bathroom[];
  },
  async fetchBathroomsByFloor2(
    floor_id: string,
    gender?: Gender, // gender를 넘기면 그 성별만 필터링, 안 넘기면 둘 다 가져오기
  ): Promise<Bathroom[]> {
    // 1단계: floor_number로 층 정보 한 줄 찾기
    const { data: floor, error: floorError } = await supabase
      .from('floors')
      .select('id, floor_number, name')
      .eq('floor_number', floorNumber)
      .maybeSingle(); // 1줄 또는 null 가능

    if (floorError) {
      console.error('❌ 층 정보 조회 실패', floorError);
      throw floorError;
    }

    if (!floor) {
      // 해당 층이 아예 없으면, 빈 배열 리턴
      return [];
    }

    // 2단계: 그 층에 속한 bathrooms 가져오기
    let query = supabase
      .from('bathrooms')
      .select('id, floor_id, gender, name')
      .eq('floor_id', floor.id as string); // 이 층에 속한 화장실만

    // gender가 넘어왔으면 남/여 필터 추가
    if (gender) {
      query = query.eq('gender', gender);
    }

    const { data, error } = await query.order('gender', { ascending: true });

    if (error) {
      console.error('❌ 화장실 목록 조회 실패', error);
      throw error;
    }

    return (data ?? []) as Bathroom[];
  },

  //
  // 2-3. 특정 화장실의 칸 목록 가져오기 (stalls)
  //
  // ❗️중요: gender는 stalls 테이블에 "없어도 정상"이야.
  //     - stalls 는 "어느 화장실인지" bathroom_id 로만 알고 있고
  //     - 성별 정보는 bathrooms 테이블에 gender 컬럼으로 있음. :contentReference[oaicite:3]{index=3}
  //
  // 그래서:
  //   - 화면에서 Bathroom를 선택했을 때 bathroom.id 를 함께 넘겨주고
  //   - 여기서는 bathroom_id 기준으로 칸들을 가져오면 됨.
  //

  async fetchStallsByBathroomId(bathroom_id: string): Promise<Stall[]> {
    const { data, error } = await supabase
      .from('stalls')
      .select(
        'id, bathroom_id, bathroom_name,stall_number,type,status,created_at',
      )
      .order('stall_number', { ascending: true });
    let stalls: Stall[] = [];
    data?.forEach(stall => {
      if (bathroom_id === stall.bathroom_id) {
        stalls.push(stall);
      }
    });

    if (error) {
      console.error('❌ 화장실 목록 조회 실패', error);
      throw error;
    }

    return (stalls ?? []) as Stall[];
  },

  //
  // 2-4. 칸 상태(status) 바꾸기
  //
  // - stalls.status 컬럼 값: 'vacant' / 'occupied' / 'broken'
  // - 예:
  //    - 사람이 들어가면 'occupied'
  //    - 사용이 끝나면 'vacant'
  //    - 고장 신고일 때는 'broken'
  //
  async updateStallStatus(stallId: string, status: StallStatus): Promise<void> {
    const { error } = await supabase
      .from('stalls')
      .update({ status }) // { status: status } 와 동일 (ES6 단축 문법)
      .eq('id', stallId); // id가 stallId인 한 줄만 업데이트

    if (error) {
      console.error('❌ 칸 상태 변경 실패', error);
      throw error;
    }

    // 성공 시 따로 리턴할 데이터는 없어서 void
  },

  //
  // (선택) 2-5. "층 + 성별"로 한 번에 칸 목록 가져오기
  //
  // - Hooks / 화면에서 편하게 쓰라고 만든 "헬퍼 메서드"
  // - 내부에서는 위에 만든 함수들을 재사용한다:
  //     1) fetchBathroomsByFloor 로 해당 층 + 성별 화장실 찾기
  //     2) 그 화장실 id로 fetchStallsByBathroomId 호출
  //
  async fetchStallsByFloorAndGender(
    floorNumber: number,
    gender: Gender,
  ): Promise<Stall[]> {
    // 1) 층 + 성별로 화장실 목록 찾기 (보통 1개만 있을 것)
    const bathrooms = await this.fetchBathroomsByFloor(floorNumber, gender);

    if (!bathrooms.length) {
      // 해당 층에 해당 성별 화장실이 없으면 빈 배열
      return [];
    }

    const bathroom = bathrooms[0]; // 일단 첫 번째 화장실만 사용

    // 2) 그 화장실의 칸 목록 가져오기
    return this.fetchStallsByBathroomId(bathroom.id);
  },
};
