

export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  emailVarified: boolean;
  updatedAt: Date;
  profilePicture?: string;
}

export interface WorkSpaceMemberType {
  _id: string;
  user: User;
  role: "admin" | "member" | "owner" | "viewer";
  joinedAt: Date;
}

export interface WorkSpaceType {
  _id: string;
  name: string;
  description?: string;
  owner: User | string; // User object or user ID
  color: string;
  members: WorkSpaceMemberType[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  PLANNING = "Planning",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  ON_HOLD = "On Hold",
  CANCELLED = "Cancelled",
}

export type TaskStatus = "To Do" | "In Progress" | "Done"


export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export interface subtaskType {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface AttachmentType {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  uploadedBy: User | string;
  uploadedAt: Date;
}

export interface TaskType {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assignee: User | string;
  assignees?: User[];
  createdAt: Date;
  updatedAt: Date;
  project: ProjectType;
  tags?: string[];
  isArchived?: boolean;
  createdBy: User | string;
  subTasks?: subtaskType[];
  watchers?: User[];
  attachments?: AttachmentType[];
}

export enum ProjectMemberRole{
  MANAGER = "manager",
  CONTRIBUTOR = "contributor",
  VIEWER = "viewer"
}

export interface ProjectMemberType{
    user: User | string;
    role: ProjectMemberRole;
}

export interface ProjectType {
  _id: string;
  title: string;
  description?: string;
  workspace: WorkSpaceType;
  members: ProjectMemberType[];
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  dueDate?: Date;
  progress?: number;
  tasks?: TaskType[];
  isArchived?: boolean;
}
