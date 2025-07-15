import DataNotFound from "@/components/common/dataNotFound";
import Loader from "@/components/common/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAddCommentMutation, useGetCommentsByTaskIdQuery } from "@/hooks/useTasks";
import type { Comment, User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";


function CommentSection({ taskId, members }: { taskId: string; members: User[] }) {
    const [newComment, setNewComment] = useState("");

    const { mutate: addComment, isPending } = useAddCommentMutation();
    const { data: comments, isLoading } = useGetCommentsByTaskIdQuery(taskId)  as {
        data: Comment[];
        isLoading: boolean;
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        addComment(
            { taskId, text: newComment },
            {
                onSuccess: () => {
                    setNewComment("");
                    toast.success("Comment added successfully");
                },
                onError: (error: any) => {
                    toast.error(error.response.data.message);
                    console.log(error);
                },
            }
        );
    };

    if(!comments) return <div className='h-20 flex items-center rounded-xl justify-center text-secondary-font bg-surface border border-main-border'>
            Failed to load Comments.
        </div>

    if (isLoading)
        return (
            <div>
                <Loader />
            </div>
        );

    return (
        <div className="bg-surface border border-main-border rounded-lg p-6 shadow-sm">
            <h3 className="text-base font-semibold text-main-font mb-3">Comments</h3>

            <ScrollArea className="h-[300px] mb-4">
            {comments?.length > 0 ? (
                comments.map((comment) => (
                <div key={comment._id} className="flex gap-4 py-3 border-b border-glass-shadow last:border-b-0">
                    <Avatar className="size-8 border bg-deep-surface border-glass-shadow">
                    <AvatarImage src={comment.author.profilePicture} />
                    <AvatarFallback className="bg-theme-tertiary border-main-bg text-main-bg font-bold">
                        {comment.author.name.charAt(0)}
                    </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm text-main-font">
                        {comment.author.name}
                        </span>
                        <span className="text-xs text-secondary-font">
                        {formatDistanceToNow(comment.createdAt, {
                            addSuffix: true,
                        })}
                        </span>
                    </div>
                    <p className="text-sm text-secondary-font">{comment.text}</p>
                    </div>
                </div>
                ))
            ) : (
                <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">No comment yet</p>
                </div>
            )}
            </ScrollArea>

            <Separator className="my-4 border-glass-shadow bg-glass-shadow" />

            <div className="mt-4">
            <Textarea
                className="bg-surface border border-main-border focus:border-theme-primary resize-none"
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />

            <div className="flex justify-end mt-4">
                <Button
                className="bg-theme-primary text-white hover:bg-theme-primary/90"
                disabled={!newComment.trim() || isPending}
                onClick={handleAddComment}
                >
                Post Comment
                </Button>
            </div>
            </div>
        </div>
    );
}

export default CommentSection