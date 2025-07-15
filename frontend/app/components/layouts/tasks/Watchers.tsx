import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/types';
import React from 'react'

function Watchers({watchers}: {watchers: User[]}) {
    return (
        <div className="bg-surface border border-main-border rounded-xl px-5 py-4 mb-6">
            <h3 className="text-base font-semibold text-main-font mb-3">Watchers</h3>
            <div className="flex flex-col gap-3">
                {watchers && watchers.length > 0 ? (
                    watchers.map((watcher) => (
                        <div key={watcher._id} className="flex items-center gap-3">
                            <Avatar className="size-8 border border-main-border">
                                <AvatarImage src={watcher.profilePicture} />
                                <AvatarFallback className="bg-deep-surface text-main-font text-sm font-bold">
                                    {watcher.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-secondary font-medium">{watcher.name}</span>
                        </div>
                    ))
                ) : (
                    <span className="text-sm text-muted-foreground">No watchers</span>
                )}
            </div>
        </div>
    );
}

export default Watchers