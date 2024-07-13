
export interface Dashboard {
    studentSums:string,//学生总数
    evaluatedStudentCount :string,//已评价的学生总数
    unevaluatedStudentCount:string,//未评价的学生总数
    averageScore :string,//平均分数
    evaluatedStudentPercentage :string,//已评价学生占比
    unevaluatedStudentPercentage: string,//未评价学生占比
    selfPercentage:number,
    peerPercentage:number,
    teacherPercentage:number,
    TotalCount:number,
    classHourCount :number,
    hourList:number[],
    userList : string[],
    studentEvaluationSummaryDtos: StudentEvaluationSummary[],
    evaluationDtos : Evaluation[],
    [key: string]: unknown;
  }
  export interface StudentEvaluationSummary {
    id:number;
    username: string;
    fullname: string;
    averageScore: number;
  }

//   // 定义评价类型的枚举
// export enum EvaluationType {
//   Self = "Self",
//   Peer = "Peer",
//   Teacher = "Teacher"
// }

  // 定义评价类型的枚举
  export enum EvaluationType {
    Self = 0,
    Peer = 1,
    Teacher = 2
  }
// 定义Evaluation模型
export interface Evaluation {
  studentCadreName: string;  // 被评价的学生干部姓名
  evaluatorName: string;     // 评价者姓名
  evaluationType: EvaluationType;  // 评价类型
  score: number | null;      // 评分
  comments: string;          // 评价内容
  evaluationDate: string;    // 评价日期，字符串格式
  id :number;
}

// 定义评价类型描述的映射
const EvaluationTypeDescriptions: Record<EvaluationType, string> = {
  [EvaluationType.Self]: "自评",
  [EvaluationType.Peer]: "互评",
  [EvaluationType.Teacher]: "教师评价"
};

// // 定义评价类型描述的映射
// const EvaluationTypeDescriptionsInt: Record<EvaluationTypeInt, string> = {
//   [EvaluationTypeInt.Self]: "自评",
//   [EvaluationTypeInt.Peer]: "互评",
//   [EvaluationTypeInt.Teacher]: "教师评价"
// };

// 创建一个转换函数，将 EvaluationType 枚举值转换为字符串描述
export function getEvaluationTypeDescription(type: EvaluationType): string {
  return EvaluationTypeDescriptions[type] || "未知类型";
}

// // 创建一个转换函数，将 EvaluationType 枚举值转换为字符串描述
// export function getEvaluationTypeDescriptionInt(type: EvaluationTypeInt): string {
//   return EvaluationTypeDescriptionsInt[type] || "未知类型";
// }


// 公告接口
export interface Announcement {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
}
