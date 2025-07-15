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

export type TaskStatus = "To Do" | "In Progress" | "Done";

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
  subtasks?: subtaskType[];
  watchers?: User[];
  attachments?: AttachmentType[];
}

export enum ProjectMemberRole {
  MANAGER = "manager",
  CONTRIBUTOR = "contributor",
  VIEWER = "viewer",
}

export interface ProjectMemberType {
  user: User;
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

export type ResourceType =
  | "Task"
  | "Project"
  | "Workspace"
  | "Comment"
  | "User";

export type ActionType =
  | "created_task"
  | "updated_task"
  | "created_subtask"
  | "updated_subtask"
  | "completed_task"
  | "created_project"
  | "updated_project"
  | "completed_project"
  | "created_workspace"
  | "updated_workspace"
  | "added_comment"
  | "added_member"
  | "removed_member"
  | "joined_workspace"
  | "added_attachment";

export interface ActivityLog {
  _id: string;
  user: User;
  action: ActionType;
  resourceType: ResourceType;
  resourceId: string;
  details: any;
  createdAt: Date;
}

export interface CommentReaction {
  emoji: string;
  user: User;
}

export interface Comment {
  _id: string;
  author: User;
  text: string;
  createdAt: Date;
  reactions?: CommentReaction[];
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
  }[];
}

export interface StatsCardProps {
  totalProjects: number;
  totalTasks: number;
  totalProjectInProgress: number;
  totalTaskCompleted: number;
  totalTaskToDo: number;
  totalTaskInProgress: number;
}

export interface TaskPriorityData {
  name: string;
  value: number;
  color: string;
}

export interface TaskTrendsData {
  name: string;
  completed: number;
  inProgress: number;
  todo: number;
}

export interface ProjectStatusData {
  name: string;
  value: number;
  color: string;
}

export interface WorkspaceProductivityData {
  name: string;
  completed: number;
  total: number;
}
