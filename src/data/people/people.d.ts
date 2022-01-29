export type People = {
  // 年齢
  age: number;
  // 性別
  gender: string;

  // 国籍
  nationality: string;
  // 出身地
  hometown: string;
  // 居住地
  residence?: string;

  // 結婚した？
  married?: boolean;
  // 離婚した？
  divorced?: boolean;
  // 子供の数
  children?: number;
  // 世帯人数
  households?: number;

  // 教育
  education?: string;

  // 職業
  job?: string;
  // 収入
  income?: number;
  // 可処分時間
  disposableTime: number;

  // 友人関係
  friends?: number;

  // 障害の有無
  disability?: string;
  disabilityGrade?: number;

  satisfaction: number;
  comment?: string;
};
