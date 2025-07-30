import Loader from "@/components/common/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetWorkspaceDetailsQuery } from "@/hooks/useWorkspace";
import type { WorkSpaceType } from "@/types";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export function meta() {
    return [
        { title: "Members - Sync" },
        { name: "description", content: "Dashboard" },
    ];
}

function Members() {
    const [searchParams, setSearchParams] = useSearchParams();

    const workspaceId = searchParams.get("workspaceId");
    const initialSearch = searchParams.get("search") || "";
    const [search, setSearch] = useState<string>(initialSearch);

    useEffect(() => {
        const params: Record<string, string> = {};

        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        params.search = search;

        setSearchParams(params, { replace: true });
    }, [search]);

    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        if (urlSearch !== search) setSearch(urlSearch);
    }, [searchParams]);

    const { data, isLoading } = useGetWorkspaceDetailsQuery(workspaceId!) as {
        data: WorkSpaceType;
        isLoading: boolean;
    };

    if (!workspaceId) {
        return <div className="h-full w-full flex flex-col items-center justify-center text-center text-muted-foreground px-4">
            <div className="text-2xl font-semibold mb-2">No Workspace Selected</div>
            <p className="text-sm max-w-md">
                We couldn't load the workspace data. Please select a workspace to view Members.
            </p>
        </div>
    }

    if (isLoading)
        return (
            <div className="h-full w-full flex justify-center items-center">
                <Loader />
            </div>
        );

    if (!data) return <div className='h-full flex items-center justify-center text-secondary-font'>
        Failed to load workspace data.
    </div>;

    const filteredMembers = data?.members?.filter(
        (member) =>
            member.user.name.toLowerCase().includes(search.toLowerCase()) ||
            member.user.email.toLowerCase().includes(search.toLowerCase()) ||
            member.role?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-start md:items-center justify-between">
                <h1 className="text-2xl font-bold">Workspace Members</h1>
            </div>

            <Input
                placeholder="Search members ...."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md bg-surface border-main-border"
            />

            <Tabs defaultValue="list">
                <TabsList>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="board">Board View</TabsTrigger>
                </TabsList>

                {/* LIST VIEW */}
                <TabsContent value="list">
                    <Card className="bg-surface border-main-border text-main-font">
                        <CardHeader>
                            <CardTitle>Members</CardTitle>
                            <CardDescription>
                                {filteredMembers?.length} members in your workspace
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="divide-y">
                                {filteredMembers.map((member) => (
                                    <div
                                        key={member.user._id}
                                        className="flex flex-col md:flex-row items-center justify-between p-4 gap-3"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="bg-surface border border-glass-shadow">
                                                <AvatarImage src={member.user.profilePicture} />
                                                <AvatarFallback className="bg-surface border border-main-border">
                                                    {member.user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.user.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {member.user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-1 ml-11 md:ml-0">
                                            <Badge
                                                variant={
                                                    ["admin", "owner"].includes(member.role)
                                                        ? "destructive"
                                                        : "secondary"
                                                }
                                                className="capitalize"
                                            >
                                                {member.role}
                                            </Badge>

                                            <Badge variant={"outline"}>{data.name}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BOARD VIEW */}
                <TabsContent value="board">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredMembers.map((member) => (
                            <Card key={member.user._id} className="bg-surface border-main-border text-main-font">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <Avatar className="bg-gray-500 size-20 mb-4">
                                        <AvatarImage src={member.user.profilePicture} />
                                        <AvatarFallback className="uppercase bg-surface border border-main-border text-main-font font-bold">
                                            {member.user.name.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <h3 className="text-lg font-medium mb-2">
                                        {member.user.name}
                                    </h3>

                                    <p className="text-sm text-gray-500 mb-4">
                                        {member.user.email}
                                    </p>

                                    <Badge
                                        variant={
                                            ["admin", "owner"].includes(member.role)
                                                ? "destructive"
                                                : "secondary"
                                        }
                                    >
                                        {member.role}
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default Members