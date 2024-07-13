
export interface User {
  id: string;
  username:string;
  fullname: string;
  avatarpath: string;
  avatar: string;
  email: string;
  role: UserRole;
  gender :Gender;
  position : string;
  organization :string;
  totalScore :string;
  passwordHash :string;
  classhour : number;
  avatarFile?: File | null; // 添加 avatarFile 字段
  selfScore? :string;//自我评价分数
  evaluatorId: string;//评价者ID
  evaluatorsorce: number;//评价者打分
  peerAverageScore:string; // 互评分数
  teacherAverageScore :string; //教师分数
  [key: string]: unknown;
}

export enum UserRole {
  admin = 0,
  teacher = 1,
  studentCadre = 2,
}

export enum Gender {
  male = 0,
  female = 1,
}

//界面显示
// 将映射对象放在这里
export const UserRoleMap = {
  [UserRole.admin]: '管理员',
  [UserRole.teacher]: '教师',
  [UserRole.studentCadre]: '学生干部',
};

export const GenderMap = {
  [Gender.male]: '男',
  [Gender.female]: '女',
};

// // 创建一个角色映射对象，将数据库中的整数值映射到 UserRole 枚举
// const roleMap = {
//   0: UserRole.admin,
//   1: UserRole.teacher,
//   2: UserRole.studentCadre
// } as const;

// type RoleMapKey = keyof typeof roleMap;

// const genderMap = {
//   0: Gender.male,
//   1: Gender.female,
// } as const;

// type GenderMapKey = keyof typeof genderMap;

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem('current-user');
  if (userJson) {
    try {
      const parsedUser: Partial<User> = JSON.parse(userJson);
      if (typeof parsedUser === 'object' && parsedUser !== null) {
        // // 将角色从整数值转换为 UserRole 枚举
        // if (typeof parsedUser.role === 'number') {
        //   parsedUser.role = UserRoleMap[parsedUser.role as keyof typeof UserRoleMap] as unknown as number;
        // }
        // // 将性别从整数值转换为 Gender 枚举
        // if (typeof parsedUser.gender === 'number') {
        //   parsedUser.gender = GenderMap[parsedUser.gender as keyof typeof GenderMap] as unknown as number;
        // }
        // 确保 ID 是字符串
        if (parsedUser.id) {
          parsedUser.id = String(parsedUser.id);
        }
        // 确保 ID 是字符串
        if (parsedUser.id) {
          parsedUser.totalScore = String(parsedUser.totalScore);
        }
        return parsedUser as User;
      } else {
        console.error('用户信息不是有效的对象:', userJson);
        return null;
      }
    } catch (error) {
      console.error('解析用户信息时出错:', error);
      return null;
    }
  }
  return null;
}

