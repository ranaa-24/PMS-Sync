export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  emailVarified: boolean;
  updatedAt: Date;
  profilePicture?: string;
}

interface WorkSpaceMemberType {
  user: User;
  role: "admin" | "member" | "owner" | "viewer";
  joinedAt: Date;
}

export interface WorkSpaceType {
  _id: string;
  name: string;
  description?: string;
  owner: User | string;
  workSpaceColor: string;
  members: WorkSpaceMemberType[];
  createdAt: Date;
  updatedAt: Date;
}
