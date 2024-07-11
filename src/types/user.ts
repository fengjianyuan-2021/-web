export interface User {
  id: string;      //id
  name?: string;   //姓名
  avatar?: string; //头像
  // email?: string;

  [key: string]: unknown;
}
